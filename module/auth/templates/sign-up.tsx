import Input from "@/ui/input";

export default function SIGNUP() {
  return (
    <>
      <div className="flex gap-x-2 w-full">
        <Input
          label="First name"
          name="first_name"
          required
          autoComplete="given-name"
          className="w-full"
          autoFocus
        />
        <Input
          label="Last name"
          name="last_name"
          required
          autoComplete="family-name"
          className="w-full"
        />
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
      />
      <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
    </>
  );
}
