import { Comment, Post, Subject, User } from './../domain/kakomon-share';
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
// 科目情報を取得する関数
export const getSubjects = async () => {
    const subjects = await supabase.from("kamoku").select("*");
    const subjectsData = subjects.data!.map((subject)=>{
        return new Subject(subject.id,subject.year,subject.name);
    });
    return subjectsData;
}

// 科目idからユーザーidを取得する関数
export const getSubjectUserIds = async (subjectId:number) => {
    const users = await supabase.from("kamoku_user").select("user_id").eq("kamoku_id",subjectId);
    return users.data;
}

// ユーザーidからユーザー情報を取得する関数
export const getUserInfo = async (userId:number) => {
    const user = await supabase.from("user").select("*").eq("id",userId);
    const userData = user.data!.map((user)=>{
        return new User(user.id,user.name,user.kakao_id,user.description,user.firebase_user_id);
    });
    return userData;
}

// ユーザー情報を追加する関数
export const addUser = async (name: string, subjectName: number, kakaoId: string, description: string,firebase_user_id: string) => {
    const { data, error } = await supabase
        .from("user")
        .insert({ name, kakao_id: kakaoId, description, subject_id: subjectName,firebase_user_id })
        .select('id')
        .single();
    if (error) {
        console.error('Error adding user:', error);
        throw error;
    }
    return data.id;
};

// ユーザー情報(備考のみ)を更新する関数
export const updateUserInfo = async (userId:number, description: string) => {
    await supabase.from("user").update({description}).eq("id",userId);
}


// 科目とユーザーの中間テーブルにデータを追加する関数
export const addUserToSubject = async (subjectId:number,userId: number) => {
    await supabase.from("kamoku_user").insert({kamoku_id:subjectId,user_id:userId});
}