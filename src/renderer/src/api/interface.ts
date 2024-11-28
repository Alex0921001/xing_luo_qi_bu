export interface BASICITEM {
  Id: number
  name: string
  type: string
  subType: string
  x: string
  y: string
  comment: string
}

export type STARITEM = BASICITEM
export type BOXITEM = BASICITEM & { fullName: string }
export type GANITEM = BASICITEM & { fullName: string }
export type DIZHIITEM = BASICITEM & { fullName: string }
