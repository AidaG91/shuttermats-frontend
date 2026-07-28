function renderInline(text, keyPrefix) {
  const nodes = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[1]}</strong>);
    } else {
      const isMail = match[3].startsWith("mailto:");
      nodes.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={match[3]}
          target={isMail ? undefined : "_blank"}
          rel={isMail ? undefined : "noopener noreferrer"}
        >
          {match[2]}
        </a>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let listItems = null;
  let key = 0;

  const flushList = () => {
    if (listItems) {
      blocks.push(
        <ul key={`ul-${key++}`}>
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item, `li-${key}-${idx}`)}</li>
          ))}
        </ul>,
      );
      listItems = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushList();
      continue;
    }

    if (line === "---") {
      flushList();
      blocks.push(<hr key={`hr-${key++}`} />);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const content = renderInline(heading[2], `h-${key}`);
      if (level === 1) blocks.push(<h1 key={key++}>{content}</h1>);
      else if (level === 2) blocks.push(<h2 key={key++}>{content}</h2>);
      else blocks.push(<h3 key={key++}>{content}</h3>);
      continue;
    }

    const listItem = line.match(/^\*\s+(.*)$/);
    if (listItem) {
      listItems = listItems ?? [];
      listItems.push(listItem[1]);
      continue;
    }

    flushList();
    blocks.push(<p key={key++}>{renderInline(line, `p-${key}`)}</p>);
  }

  flushList();
  return blocks;
}
