import { ReadyState } from "react-use-websocket"

type Props = {
  readyState: ReadyState;
}

export function ConnectionBanner({ readyState }: Props) {
  switch (readyState) {
    case ReadyState.OPEN:
      return <div className="banner banner--good" />
    case ReadyState.CONNECTING:
      return <div className="banner banner--warning">Connecting</div>
    default:
      return <div className="banner banner--error">Not connected</div>
  }
}
