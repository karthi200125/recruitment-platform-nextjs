export const resetPasswordTemplate = (link: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>
    
    <a href="${link}" 
       style="background:black;color:white;padding:10px 20px;text-decoration:none;">
       Reset Password
    </a>

    <p style="margin-top:20px;">This link expires in 15 minutes.</p>
  </div>
`;