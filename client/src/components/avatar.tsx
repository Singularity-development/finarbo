import useAuth from "@/features/auth/useAuth";

const Avatar = () => {
  const { profile } = useAuth();
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
