import { useGetProfileQuery } from "@/services/apis/auth/auth.api";

const Avatar = () => {
  const { data: profile } = useGetProfileQuery();

  return (
    <img
      className="rounded-full"
      src={profile?.avatarUrl ?? "/public/assets/images/default_avatar.png"}
      alt="Avatar"
      width={32}
      height={32}
    />
  );
};

export default Avatar;
