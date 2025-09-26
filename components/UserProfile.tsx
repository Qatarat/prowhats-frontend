export default function UserProfile() {
  return (
    <div className="flex items-center gap-2 mt-2">
      <img
        src="https://i.pravatar.cc/40?img=3"
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm font-medium leading-none">Shadon</p>
        <p className="text-xs text-gray-500">m@example.com</p>
      </div>
    </div>
  );
}
