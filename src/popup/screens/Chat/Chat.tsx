import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import useChatGPT from "../../../hooks/useChatGPT";
import { m_Message } from "../../../models/m_Message";
import { answerQuestion } from "../../../services/chatgpt";
import styles from "./Chat.module.css";
import Composer from "./Composer/Composer";
import EmptyMessages from "./EmptyMessages/EmptyMessages";
import MessageItem from "./MessageItem/MessageItem";
import ScrollToBtn from "./ScrollToBtn/ScrollToBtn";

interface props {}

const Chat = ({}: props) => {
  const [messages, setMessages] = useState<m_Message[]>([]);
  const composerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [scrollToBottomVisible, setScrollToBottomVisible] =
    useState<boolean>(false);
  const { currentPageEmbedding } = useChatGPT();
  useEffect(() => {
    if (!composerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!rowsRef.current) return;
      rowsRef.current.style.borderBottomWidth = `${composerRef.current?.clientHeight}px`;
    });
    resizeObserver.observe(composerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = (e: any) => {
    setScrollToBottomVisible(e.target.scrollTop < -50); // show only if scrolled up more than 50px
  };

  const onSubmitMessage = (message: string) => {
    if (currentPageEmbedding === undefined) return;
    setMessages((prev) => [
      ...prev,
      {
        id: uuid(),
        message,
        createdAt: new Date(),
        createdByDisplayName: "You",
      },
    ]);
    answerQuestion(message, currentPageEmbedding)
      .then((answer) => {
        if (answer === undefined) return;
        setMessages((prev) => [
          ...prev,
          {
            id: uuid(),
            message: answer,
            createdAt: new Date(),
            createdByDisplayName: "Chatbot",
          },
        ]);
      })
      .catch((e) => {
        setMessages((prev) => [
          ...prev,
          {
            id: uuid(),
            message: `Error: ${e.message}`,
            createdAt: new Date(),
            createdByDisplayName: "Chatbot",
          },
        ]);
      });
  };

  const scrollToBottom = () => {
    if (!rowsRef.current) return;
    rowsRef.current.scrollTo({
      top: rowsRef.current.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div ref={rowsRef} className={styles["rows"]} onScroll={handleScroll}>
        {messages.length === 0 && <EmptyMessages />}

        <>
          {messages.map((message) => {
            return (
              <MessageItem
                key={message.id}
                containerStyles={{ marginBottom: "1em" }}
                message={message}
                onMessageClick={(m) => console.log(m)}
              ></MessageItem>
            );
          })}

          <ScrollToBtn
            visible={scrollToBottomVisible}
            onClick={scrollToBottom}
          />
        </>
      </div>
      <div ref={composerRef} className={styles["composer"]}>
        <Composer
          placeholder="Ask a question about this page"
          onSubmit={onSubmitMessage}
          isDisabled={currentPageEmbedding === undefined}
        ></Composer>
      </div>
    </>
  );
};

export default Chat;
