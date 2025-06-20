import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-gray-800 select-none">MyApp</div>

      {/* Clerk Auth Components */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
                userButtonPopoverCard: "shadow-lg",
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  )
}

export default Navbar
