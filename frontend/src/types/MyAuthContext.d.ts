type MyAuthContext = {
    isAuthorized: boolean,
    setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    payload: UserPayload,
    setPayload: React.Dispatch<React.SetStateAction<UserPayload>>
}