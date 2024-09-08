import { Comment, Post } from './../domain/kakomon-share';
import { supabase }  from "../lib/supabase"

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