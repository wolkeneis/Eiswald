import { useLocation } from "react-router";
import "./Authorize.scss";

const Authorize = () => {
  const query = new URLSearchParams(useLocation().search);

  const transactionId = query.get("transactionId");
  const username = query.get("username");
  const client = query.get("client");

  const valid = transactionId && username && client;

  return (
    <div className="Authorize">
      {valid
        ? <>
          <h3>{username}</h3>
          <p>
            <b>{client} </b>
            is Requesting access to your account.
          </p>
          <form action={`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/oauth2/authorize`} method="post">
            <input name="transaction_id" type="hidden" value={transactionId} />
            <div className="AuthorizeButtons">
              <input name="cancel" type="submit" className="DenyButton" value="Deny" />
              <input type="submit" className="AllowButton" value="Allow" />
            </div>
          </form>
        </>
        : <>
          <h3>An error occurred.</h3>
          <form action={`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/oauth2/authorize`} method="post">
            <input name="transaction_id" type="hidden" value={transactionId} />
            <div className="AuthorizeButtons">
              <input name="cancel" type="submit" className="DenyButton" value="Back" />
            </div>
          </form>
        </>
      }

    </div>
  );
}

export default Authorize;
