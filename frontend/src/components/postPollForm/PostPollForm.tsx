import { MdClose } from "react-icons/md";

interface Props {
    postForm: PostForm;
    setPostForm: React.Dispatch<React.SetStateAction<PostForm>>;
    setIsPollFormActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostPollForm = ({ postForm, setPostForm, setIsPollFormActive }: Props) => {

    function handleChange(e: React.FormEvent, index: number) {
        const input = e.target as HTMLInputElement;
        setPostForm(prev => {
            const newPoll = [...prev.poll];
            newPoll[index] = input.value;
            return { ...prev, poll: newPoll };
        });
    }

    function handleAddOption() {
        setPostForm(prev => {
            const newValue = { ...prev };
            newValue.poll.push('');
            return newValue;
        });
    }

    function handleDeleteOption(index: number) {
        setPostForm(prev => {
            const newValue = { ...prev };
            newValue.poll.splice(index, 1);
            return newValue;
        });
    }

    function handleCancel() {
        setPostForm(prev => {
            const newValue = { ...prev };
            newValue.poll = [];
            return newValue;
        });
        setIsPollFormActive(false);
    }

    function handleSave() {
        setIsPollFormActive(false);
    }

    return (
        <>
            <div className="fixed inset-0 bg-overlayBlack"></div>
            <div data-testid='postPollForm' className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[95%] bg-white border-[3px] border-primary rounded-2xl p-4 flex flex-col items-center gap-4 max-[400px]:gap-7">
                {
                    postForm.poll.map((item, index) => (
                        <div key={index} className="flex items-center max-[400px]:flex-col gap-3 max-[400px]:gap-1">
                            <input data-testid='pollOptionInput' onChange={(e) => handleChange(e, index)} className="w-full text-3xl max-sm:text-2xl p-2 border-2 border-primary rounded-xl" value={item} type="text" maxLength={20} required />
                            <button onClick={() => handleDeleteOption(index)} className="text-5xl max-sm:text-4xl text-red-600" title="Usuń opcję" type="button">
                                <MdClose />
                            </button>
                        </div>
                    ))
                }
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button onClick={handleAddOption} type="button" className="text-2xl max-sm:text-xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-4 py-2 rounded-full">Dodaj opcję</button>
                    <button onClick={handleCancel} type="button" className="text-2xl max-sm:text-xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-4 py-2 rounded-full">Anuluj</button>
                    <button onClick={handleSave} type="button" className="text-2xl max-sm:text-xl text-white font-medium bg-primary hover:bg-primaryHover transition-primary px-4 py-2 rounded-full">Zapisz</button>
                </div>
            </div>
        </>
    )
}

export default PostPollForm
