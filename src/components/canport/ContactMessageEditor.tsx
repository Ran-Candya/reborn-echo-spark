import { useRef, useState } from 'react';
import { Bold, Italic, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactMessageEditorProps {
  value: string;
  onChange: (text: string) => void;
  invalid: boolean;
}

export function ContactMessageEditor({ value, onChange, invalid }: ContactMessageEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);

  const update = () => onChange(editorRef.current?.innerText.trim() ?? '');
  const format = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    update();
  };

  return (
    <div className={`overflow-hidden rounded-2xl border bg-[#FAF7F2] transition-colors focus-within:bg-white ${invalid ? 'border-red-500' : 'border-[#E6DDD0] focus-within:border-[#7A583E]'}`}>
      {activated && (
        <div className="flex items-center gap-1 border-b border-[#E6DDD0] px-2 py-1.5" role="toolbar" aria-label="Mise en forme du message">
          {[
            { title: 'Gras', icon: Bold, command: 'bold' },
            { title: 'Italique', icon: Italic, command: 'italic' },
            { title: 'Puces', icon: List, command: 'insertUnorderedList' },
          ].map(({ title, icon: Icon, command }) => (
            <Button key={command} type="button" variant="ghost" size="icon" title={title} aria-label={title}
              className="h-9 w-9 text-[#3E3228] hover:bg-[#F2ECE2]"
              onMouseDown={(event) => event.preventDefault()} onClick={() => format(command)}>
              <Icon aria-hidden="true" />
            </Button>
          ))}
        </div>
      )}
      <div className="relative px-4 py-3">
        {!value && <span aria-hidden="true" className="pointer-events-none absolute left-4 top-3 text-xs text-[#9A8A7B] sm:text-sm">Gestion des emails, retard de facturation, suivi des clients...</span>}
        <div ref={editorRef} id="contact-needs" role="textbox" aria-multiline="true" aria-required="true" aria-invalid={invalid}
          contentEditable suppressContentEditableWarning
          onFocus={() => setActivated(true)}
          onInput={update} className="min-h-32 w-full outline-none text-xs leading-relaxed text-[#2D241E] sm:text-sm" />
      </div>
    </div>
  );
}