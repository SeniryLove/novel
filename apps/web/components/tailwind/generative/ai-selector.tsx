"use client";

import { Command, CommandInput } from "@/components/tailwind/ui/command";
import { ArrowUp } from "lucide-react";
import { useEditor } from "novel";
import { addAIHighlight } from "novel";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CrazySpinner from "../ui/icons/crazy-spinner";
import Magic from "../ui/icons/magic";
import { ScrollArea } from "../ui/scroll-area";
import AICompletionCommands from "./ai-completion-command";
import AISelectorCommands from "./ai-selector-commands";

import { apiFetch } from "@/lib/api";

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();

  const [inputValue, setInputValue] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasCompletion = completion.length > 0;

  // =========================
  // 🔥 STREAM FUNCTION (C# SSE)
  // =========================
  const runAI = async (params: {
    prompt: string;
    option: string;
    command?: string;
  }) => {
    setIsLoading(true);
    setCompletion("");

    try {
      const res = await apiFetch("/api/AI/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok || !res.body) {
        throw new Error("Network error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let result = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;

          const jsonStr = part.replace("data: ", "").trim();

          if (jsonStr === "[DONE]") continue;

          try {
            const json = JSON.parse(jsonStr);

            const token =
              json?.choices?.[0]?.delta?.content;

            if (token) {
              result += token;
              setCompletion(result);
            }
          } catch (e) {
            // ignore malformed chunk
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || "AI request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Command className="w-[350px]">
      {/* ========================= */}
      {/* OUTPUT */}
      {/* ========================= */}
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}
      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-purple-500">
          <Magic className="mr-2 h-4 w-4" />
          AI is thinking
          <div className="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* INPUT */}
      {/* ========================= */}
      {!isLoading && (
        <>
          <div className="relative">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              autoFocus
              placeholder={
                hasCompletion
                  ? "Tell AI what to do next"
                  : "Ask AI to edit or generate..."
              }
              onFocus={() => addAIHighlight(editor)}
            />

            <Button
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
              onClick={() => {
                // =========================
                // 🔥 CONTINUE FROM RESULT
                // =========================
                if (hasCompletion) {
                  runAI({
                    prompt: completion,
                    option: "zap",
                    command: inputValue,
                  }).then(() => setInputValue(""));
                  return;
                }

                // =========================
                // 🔥 FROM SELECTION
                // =========================
                const slice = editor.state.selection.content();
                const text =
                  editor.storage.markdown.serializer.serialize(
                    slice.content
                  );

                runAI({
                  prompt: text,
                  option: "zap",
                    command: inputValue,
                }).then(() => setInputValue(""));
              }}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>

          {/* ========================= */}
          {/* COMMANDS */}
          {/* ========================= */}
          {hasCompletion ? (
            <AICompletionCommands
              onDiscard={() => {
                editor.chain().unsetHighlight().focus().run();
                onOpenChange(false);
                setCompletion("");
              }}
              completion={completion}
            />
          ) : (
            <AISelectorCommands
              onSelect={(value, option) =>
                runAI({ prompt: value, option })
              }
            />
          )}
        </>
      )}
    </Command>
  );
}
