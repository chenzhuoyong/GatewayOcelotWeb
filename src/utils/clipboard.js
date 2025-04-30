import * as clipboard from "clipboard-polyfill";

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<void>}
 */
export const copyText = async (text) => {
  try {
    await clipboard.writeText(text);
    console.log("复制成功:", text);
  } catch (err) {
    console.error("复制失败（Polyfill）:", err);
    // throw err;
    // 降级到 execCommand
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    console.error("旧版本复制:", success);
    document.body.removeChild(textarea);
  }
};

/**
 * 从剪贴板读取文本
 * @returns {Promise<string>}
 */
export const pasteText = async () => {
  try {
    const text = await clipboard.readText();
    console.log("粘贴的文本:", text);
    return text;
  } catch (err) {
    console.error("粘贴失败（Polyfill）:", err);
    // throw err;
    // 降级到 execCommand
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    const success = document.execCommand("paste");
    const text = success ? textarea.value : "";
    document.body.removeChild(textarea);
    return text;
  }
};
