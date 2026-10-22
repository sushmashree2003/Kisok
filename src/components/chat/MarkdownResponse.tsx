"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownResponseProps {
  content: string;
  className?: string;
  isUser?: boolean;
}

export default function MarkdownResponse({
  content,
  className = "",
  isUser = false,
}: MarkdownResponseProps) {
  if (!content) return null;

  return (
    <div
      className={`ai-markdown-content ${isUser ? "ai-markdown-user" : "ai-markdown-bot"} ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-md-link"
              onClick={(e) => e.stopPropagation()}
            />
          ),
          table: ({ node: _node, ...props }) => (
            <div className="ai-md-table-wrapper">
              <table {...props} className="ai-md-table" />
            </div>
          ),
          th: ({ node: _node, ...props }) => <th {...props} className="ai-md-th" />,
          td: ({ node: _node, ...props }) => <td {...props} className="ai-md-td" />,
          h1: ({ node: _node, ...props }) => <h1 {...props} className="ai-md-h1" />,
          h2: ({ node: _node, ...props }) => <h2 {...props} className="ai-md-h2" />,
          h3: ({ node: _node, ...props }) => <h3 {...props} className="ai-md-h3" />,
          h4: ({ node: _node, ...props }) => <h4 {...props} className="ai-md-h4" />,
          ul: ({ node: _node, ...props }) => <ul {...props} className="ai-md-ul" />,
          ol: ({ node: _node, ...props }) => <ol {...props} className="ai-md-ol" />,
          li: ({ node: _node, ...props }) => <li {...props} className="ai-md-li" />,
          p: ({ node: _node, ...props }) => <p {...props} className="ai-md-p" />,
          hr: ({ node: _node, ...props }) => <hr {...props} className="ai-md-hr" />,
          blockquote: ({ node: _node, ...props }) => (
            <blockquote {...props} className="ai-md-blockquote" />
          ),
          code: ({
            node: _node,
            className: codeClassName,
            children,
            ...props
          }: React.ComponentPropsWithoutRef<"code"> & { node?: unknown }) => {
            const isInline =
              !codeClassName &&
              typeof children === "string" &&
              !children.includes("\n");
            if (isInline) {
              return (
                <code className="ai-md-code-inline" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="ai-md-code-block">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
