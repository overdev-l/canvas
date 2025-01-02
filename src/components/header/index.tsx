import { Button } from "@/components/ui/button"
import { Image, Frame, Type } from 'lucide-react'
import { useRenderStore, useUiStateStore } from "@/store";
import { cn } from "@/lib/utils";
import { CoreMouseMode } from "@/render/utils/enum";
import file2base64 from "@/utils/file2base64";

export default function Header() {
  const { render, renderSelection } = useRenderStore();
  const { isCreateFrame, isCreateText, setIsCreateFrame, setIsCreateText } = useUiStateStore();
  const setCreateFrame = () => {
    if (isCreateText) {
      renderSelection?.setMode(CoreMouseMode.SELECTION);
      setIsCreateText(false);
    }
    if (isCreateFrame) return;
    renderSelection?.setMode(CoreMouseMode.FRAME);
    setIsCreateFrame(true);
  }
  const setCreateText = () => {
    if (isCreateFrame) {
      renderSelection?.setMode(CoreMouseMode.SELECTION);
      setIsCreateFrame(false);
    }
    if (isCreateText) return;
    renderSelection?.setMode(CoreMouseMode.TEXT);
    setIsCreateText(true);
  }
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await file2base64(file);
      render?.addImage(base64);
    }
  }
    return (
      <header className="border-b">
        <div className="flex h-14 items-center px-4 gap-4">
          <div className="flex items-center gap-1 border-x px-3">
            <Button variant="ghost" size="icon" onClick={setCreateFrame} className={cn(isCreateFrame && 'bg-gray-200')}>
              <Frame className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Image className="h-5 w-5" />
              <input type="file" className="opacity-0 absolute w-full h-full cursor-pointer" onChange={handleImageChange} />
            </Button>
            <Button variant="ghost" size="icon" onClick={setCreateText} className={cn(isCreateText && 'bg-gray-200')}>
              <Type className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1" />
        </div>
      </header>
    )
  }
  