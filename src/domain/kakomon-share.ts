// 過去問の募集投稿の型を定義
export class Post {
    constructor(public id: number, public title: string, public name: string,public description: string,public created_at:string) {}
}

// 過去問の募集投稿のコメントの型を定義
export class Comment {
    constructor(public user_id: string, public title: string,public comment: string,public name: string,public created_at:string) {}
}

// 科目の型を定義
export class Subject {
    constructor(public id: number, public year: string, public name: string) {}
}