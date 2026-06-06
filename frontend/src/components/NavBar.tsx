import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="w-full h-16 bg-white flex justify-between px-8 items-center shadow-md">
      <div>Logo</div>
      <div className="flex gap-3 items-center">
        <Image
          width={30}
          height={30}
          alt="Profile picture"
          src="/images/image.png"
          className="rounded-full"
          priority
        />
        <p>David</p>
      </div>
    </nav>
  );
};

export default NavBar;
