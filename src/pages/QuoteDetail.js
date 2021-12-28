import { Fragment, useEffect } from "react";
import {
  useParams,
  Route,
  Link,
  useRouteMatch,
  useHistory,
} from "react-router-dom";

import HighlightedQuote from "../components/quotes/HighlightedQuote";
import Comments from "../components/comments/Comments";
import useHttp from "../hooks/use-http";
import { getSingleQuote, removeQuote } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const QuoteDetail = () => {
  const match = useRouteMatch();
  const params = useParams();
  const history = useHistory();
  const { quoteId } = params;

  const {
    sendRequest,
    status,
    data: loadedQuote,
    error,
  } = useHttp(getSingleQuote, true);

  const {
    sendRequest: deleteRequest,
    status: deleteStatus,
    error: deleteError,
  } = useHttp(removeQuote, true);

  const removeQuoteHandler = () => {
    deleteRequest(quoteId);
  };

  useEffect(() => {
    if (deleteStatus === "completed") {
      history.push("/");
    }
  }, [deleteStatus, history]);

  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="centered">{error}</p>;
  }

  if (!loadedQuote.text) {
    return <p>No quote found!</p>;
  }

  return (
    <Fragment>
      <HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />
      <Route path={match.path} exact>
        <div className="centered">
          <Link className="btn--flat m1" to={`${match.url}/comments`}>
            Load Comments
          </Link>
          <a href="#" className="btn--flat" onClick={removeQuoteHandler}>
            Delete Quote
          </a>
        </div>
      </Route>
      <Route path={`${match.path}/comments`}>
        <Comments />
      </Route>
    </Fragment>
  );
};

export default QuoteDetail;
