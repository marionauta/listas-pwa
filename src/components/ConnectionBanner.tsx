import { Button } from "react-aria-components";
import { ReadyState } from "react-use-websocket";

type Props = {
  readyState: ReadyState;
  tryReconnect: () => void;
};

export function ConnectionBanner({ readyState, tryReconnect }: Props) {
  switch (readyState) {
    case ReadyState.OPEN:
      return <div className="banner banner--good" />;
    case ReadyState.CONNECTING:
      return <div className="banner banner--warning">Connecting</div>;
    default:
      return (
        <div className="banner banner--error">
          Not connected
          <Button onPress={tryReconnect}>Reconnect</Button>
        </div>
      );
  }
}
