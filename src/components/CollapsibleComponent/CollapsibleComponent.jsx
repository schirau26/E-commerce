import { Collapsible } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import css from "./CollapsibleComponent.module.css";

export default function CollapsibleComponent({
  title = "Title",
  content = "",
}) {
  return (
    <Collapsible.Root className={css.item}>
      <Collapsible.Trigger className={css.row}>
        <span className={css.title}>{title}</span>
        <Collapsible.Indicator
          className={css.icon}
          transition="transform 0.2s"
          _open={{ transform: "rotate(90deg)" }}
        >
          <LuChevronRight size={16} />
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content className={css.body}>{content}</Collapsible.Content>
    </Collapsible.Root>
  );
}
