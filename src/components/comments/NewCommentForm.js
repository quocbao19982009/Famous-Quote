import { useRef, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import { addComment } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./NewCommentForm.module.css";

const NewCommentForm = (props) => {
  const commentTextRef = useRef();

  const { sendRequest, status, error } = useHttp(addComment);

  const [inputValue, setInputValue] = useState("");
  const [inputValid, setInputValid] = useState(true);

  const { onAddedComment } = props;

  useEffect(() => {
    if (status === "completed" && !error) {
      onAddedComment();
    }
  }, [status, error, onAddedComment]);

  const submitFormHandler = (event) => {
    event.preventDefault();

    const enteredText = commentTextRef.current.value;

    if (enteredText.trim() === "") {
      setInputValid(false);
      return;
    }
    sendRequest({ commentData: enteredText, quoteId: props.quoteId });
    setInputValid(true);
    setInputValue("");
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      {status === "pending" && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      <div
        className={`${classes.control} ${inputValid ? "" : classes.invalid}`}
        onSubmit={submitFormHandler}
      >
        <label htmlFor="comment">Your Comment</label>
        <textarea
          id="comment"
          rows="5"
          ref={commentTextRef}
          onChange={() => setInputValue(commentTextRef.current.value)}
          value={inputValue}
        ></textarea>
        {!inputValid && <p>Please eneter valid Comment</p>}
      </div>
      <div className={classes.actions}>
        <button className="btn">Add Comment</button>
      </div>
    </form>
  );
};

export default NewCommentForm;
