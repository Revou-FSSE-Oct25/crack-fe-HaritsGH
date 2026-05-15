export interface TournamentProps {
  id : number,
  name : string,
  game :string,
  startdate : string,
  status: string,
}

export interface PasswordEditProps {
  newPassword: string
  confirmPassword: string
}

export interface LoginProps {
  username: string
  password: string
}

export interface RegisterProps {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ParticipationProps {
  alias: string
  prefix: string
}