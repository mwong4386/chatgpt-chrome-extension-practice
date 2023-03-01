export class m_Message {
  constructor(
    public id: string | undefined = undefined,
    public message: string,
    public createdByDisplayName: string
  ) {}
}
