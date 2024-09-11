import { Comment, Post, Subject } from './../domain/kakomon-share';
import { supabase }  from "../lib/supabase"

/*----------------- 過去問募集関連の関数 -----------------*/
// 過去問募集情報を取得する関数
export const getKakomonPosts = async () => {
    const kakomonPosts = await supabase.from("kakomon").select("*").order("created_at", { ascending: false });
    const kakomonPostsData =  kakomonPosts.data!.map((KakomonPost)=>{
        return new Post(KakomonPost.id,KakomonPost.title,KakomonPost.name,KakomonPost.description,KakomonPost.created_at);
    });
    return kakomonPostsData;
}

// 過去問募集情報を追加する関数
export const addKakomonPost = async (title:string,name: string,description: string) => {
    await supabase.from("kakomon").insert({title,name,description});
}

// 過去問募集投稿に対してのコメントを取得する関数
export const getKakomonPostComments = async (title:string) => {
    const comments = await supabase.from("kakomon_comment").select("*").eq("title",title);
    const commentsData = comments.data!.map((comment)=>{
        return new Comment(comment.user_id,comment.title,comment.comment,comment.name,comment.created_at);
    });
    return commentsData;
}

// 過去問募集投稿に対してのコメントを追加する関数
export const addKakomonPostComment = async (title:string,name: string,comment:string) => {
    await supabase.from("kakomon_comment").insert({title,name,comment});
}

/*----------------- 科目別過去問一覧関連の関数 -----------------*/
// 科目を取得する関数
export const getSubjects = async () => {
    const subjects = await supabase.from("kamoku").select("*");
    const subjectsData = subjects.data!.map((subject)=>{
        return new Subject(subject.id,subject.year,subject.name);
    });
    return subjectsData;
}

// 1年生の科目にkakaoIdを追加する関数
// export const addKakomonIdTo1nen = async (name:string, kakomonId:string) => {
//     await supabase.from("kamoku").update({kakomon_id:kakomonId}).eq("name","1年生");
// }