import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export default function NewTweet( { user } : { user: User}) {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    
    await supabase.from("tweets").insert({ title, user_id: user.id });
  };

  return (
    <form className='border border-gray-800 border-t-0' 
    action={addTweet}>
      <div className="flex px-4 py-8">
        <div className="w-12 h-12 ">
          <Image className="rounded-full border border-gray-800" width={48} height={48}
          src={user.user_metadata.avatar_url} alt="User avatar" />
        </div>
        <input className="bg-inherit flex-1 ml-2 px-2 text-2xl leading-loose placeholder-gray-500" 
        name="title" placeholder="What is happening?!" />
      </div>
      
    </form>
  );
}
