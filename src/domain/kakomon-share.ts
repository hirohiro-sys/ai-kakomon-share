// 過去問の募集投稿の型を定義
export class Post {
    constructor(public id: number, public title: string, public name: string,public description: string,public created_at:string) {}
}