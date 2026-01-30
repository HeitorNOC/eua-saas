import { Button } from "@/components/ui/button"
import { logoutActionForm } from "@/actions/auth"
import { getSession } from "@/lib/auth/session"

export async function LogoutForm() {
  const session = await getSession()

  if (!session) {
    return null
  }

  return (
    <form action={logoutActionForm} className="w-full">
      <input type="hidden" name="accessToken" value={session.accessToken} />
      <Button variant="ghost" className="w-full justify-start">
        Sair
      </Button>
    </form>
  )
}
