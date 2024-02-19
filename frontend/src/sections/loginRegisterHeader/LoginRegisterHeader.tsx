import GoogleLogin from "../../components/googleLogin/GoogleLogin"


interface Props {
    heading: string,
    text: string,
    buttonContent: string
}

const LoginRegisterHeader = ({ heading, text, buttonContent }: Props) => {
    return (
        <header className="w-full relative flex flex-col items-center text-center gap-4 pt-28 pb-7 px-10 max-[860px]:px-3">
            <img data-testid='logo' className="absolute h-24 top-0 left-5" src="/text-logo.png" alt="logo Substantia" />
            <h1 className="text-5xl max-[460px]:text-4xl font-bold">{heading}</h1>
            <p className="text-2xl max-[460px]:text-xl text-black65 max-w-[40ch] leading-relaxed">{text}</p>
            <GoogleLogin text={buttonContent} />
            <div data-testid='lub' className="w-full flex items-center justify-between gap-1 mt-5">
                <div className="h-[3px] w-2/5 bg-black"></div>
                <p className="text-2xl font-medium">lub</p>
                <div className="h-[3px] w-2/5 bg-black"></div>
            </div>
        </header>
    )
}

export default LoginRegisterHeader
