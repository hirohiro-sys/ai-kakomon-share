# KakomonShare
学部内で定期試験や課題の過去問を共有し合えるアプリケーションです。詳しい説明は以下のQiita記事で投稿しています。

TODO: ここにQiitaのURLとアプリのモック画像を貼る

# 環境設定
プロジェクトのルートディレクトリに .env ファイルを作成し、以下のように環境変数を設定します。
```.env
// firebaseの環境変数
VITE_REACT_APP_FIREBASE_API_KEY="XXXXX"
VITE_REACT_APP_FIREBASE_AUTH_DOMAIN="XXXXX"
VITE_REACT_APP_FIREBASE_PROJECT_ID="XXXXX"
VITE_REACT_APP_FIREBASE_STORAGE_BUCKET="XXXXX"
VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID="XXXXX"
VITE_REACT_APP_FIREBASE_APP_ID="XXXXX"
VITE_REACT_APP_FIREBASE_MEASUREMENT_ID="XXXXX"

// supabaseの環境変数
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-api-key
```

# 起動方法

```
git clone https://github.com/hirohiro-sys/ai-kakomon-share.git
npm i
npm run dev
```
