import { Post } from './../domain/kakomon-share';
import { supabase }  from "../lib/supabase"

// 過去問募集情報を取得する関数
export const getKakomonPosts = async () => {
    const kakomonPosts = await supabase.from("kakomon").select("*");
    const kakomonPostsData =  kakomonPosts.data!.map((KakomonPost)=>{
        return new Post(KakomonPost.id,KakomonPost.title,KakomonPost.name,KakomonPost.description,KakomonPost.created_at);
    });
    return kakomonPostsData;
}

// 過去問募集情報を追加する関数
export const addKakomonPost = async (title:string,name: string,description: string) => {
    await supabase.from("kakomon").insert({title,name,description});
}