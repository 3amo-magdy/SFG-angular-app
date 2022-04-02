export class IdGenerator{
  public generate():string{
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString();
  }
}
