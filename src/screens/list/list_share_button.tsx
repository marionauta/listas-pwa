import { Button } from "react-aria-components";

export default function ListShareButton({ title }: { title?: string }) {
  const shareData: ShareData = {
    title: `Join ${title}`,
    text: `Join ${title} to edit collaboratively!`,
    url: window.location.toString(),
  };
  const canShare = "share" in navigator && navigator.canShare(shareData);
  async function onShare() {
    await navigator.share(shareData).catch(console.error);
  }
  return canShare ? <Button onPress={onShare}>Share</Button> : null;
}
