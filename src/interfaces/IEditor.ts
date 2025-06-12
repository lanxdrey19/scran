export default interface IEditor {
  editMessage(content: string): Promise<void>;
}