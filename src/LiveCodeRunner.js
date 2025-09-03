import React, { useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-php";

// Helper function to simulate very basic PHP execution including HTML output
function phpSimulate(code) {
  if (!code || typeof code !== "string") return "";

  // Remove PHP tags
  let phpCode = code.replace(/<\?php|\?>/g, "");

  // Remove comments
  phpCode = phpCode.replace(/\/\/.*$/gm, "");
  phpCode = phpCode.replace(/#.*$/gm, "");
  phpCode = phpCode.replace(/\/\*[\s\S]*?\*\//gm, "");

  let output = "";
  const lines = phpCode.split(/;\s*/);

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    // Handle echo/print
    if (/^(echo|print)\s+/i.test(line)) {
      let expr = line.replace(/^(echo|print)\s+/i, "").trim();

      // Handle concatenation
      let parts = expr.split(/\.|,/).map((p) => p.trim()).filter(Boolean);

      parts.forEach((part) => {
        if (/^".*"$/.test(part) || /^'.*'$/.test(part)) {
          // Strip quotes
          let val = part.slice(1, -1);
          // Handle escaped chars
          val = val
            .replace(/\\n/g, "<br/>")
            .replace(/\\t/g, "&emsp;")
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");
          output += val;
        } else if (/^\$[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
          // Simulate variable lookup (simple placeholder)
          output += `[${part}]`;
        } else {
          output += part;
        }
      });
    } else {
      // Allow plain HTML output outside PHP tags
      output += line;
    }
  });

  return output;
}

// Live code runner with line numbers
function LiveCodeRunner({ code }) {
  const [src, setSrc] = useState(code || "");
  const [output, setOutput] = useState("");

  const runCode = () => {
    setOutput(phpSimulate(src));
  };

  return (
    <div className="mt-4 border rounded-md p-3 bg-gray-50">
      <pre className="language-php text-sm p-2 bg-gray-900 text-white rounded-md overflow-x-auto">
        {src.split("\n").map((line, idx) => (
          <div key={idx} className="flex">
            <span className="select-none text-gray-500 pr-4">
              {idx + 1}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  line,
                  Prism.languages.php || Prism.languages.clike,
                  "php"
                ),
              }}
            />
          </div>
        ))}
      </pre>

      <textarea
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        rows={Math.max(6, src.split("\n").length + 2)}
        className="w-full p-2 border rounded-md font-mono text-sm resize-none mt-2"
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={runCode}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
        >
          Run PHP
        </button>
        <button
          onClick={() => setOutput("")}
          className="px-3 py-1 border rounded-md text-sm"
        >
          Clear
        </button>
      </div>

      <div className="mt-2 p-2 bg-white border rounded-md text-sm min-h-[40px]">
        <strong>Output:</strong>
        <div dangerouslySetInnerHTML={{ __html: output }} />
      </div>
    </div>
  );
}

export default LiveCodeRunner;
