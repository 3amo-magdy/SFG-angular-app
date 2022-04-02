import { IViewable } from "./IViewable";
import { link } from "./link";


export class node extends IViewable{
  private _name: string;
  private _In!: node[];
  private _Out!: node[];
  private _InLinks!: link[];
  private _OutLinks!: link[];

  private _color: string;
  private _X!: number;
  public get X(): number {
    return this._X;
  }
  public set X(value: number) {
    this._X = value;
  }
  private _x!: number;
  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._x = value;
  }
  private _y!: number;
  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._y = value;
  }

  public get OutLinks(): link[] {
    return this._OutLinks;
  }
  public set OutLinks(value: link[]) {
    this._OutLinks = value;
  }
  public get InLinks(): link[] {
    return this._InLinks;
  }
  public set InLinks(value: link[]) {
    this._InLinks = value;
  }
  public get Out(): node[] {
    return this._Out;
  }
  public set Out(value: node[]) {
    this._Out = value;
  }
  public get In(): node[] {
    return this._In;
  }
  public set In(value: node[]) {
    this._In = value;
  }

  public get name(): string {
  return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get color(): string {
    return this._color;
  }
  public set color(value: string) {
    this._color = value;
  }
  public incrementX(){
    this.X++;
  }
  public DecrementX(){
    this.X--;
  }
  public update_x(new_x:number){
    this.x = new_x;
  }
  constructor(id:string,x:number,y:number){
      super(id);
      this._color="#84b3bb";
      this._name='A'+x;
      this.X = x;
      this.y = y;
      this.In=[];
      this.Out=[];
      this.InLinks=[];
      this.OutLinks=[];
  }

}
