import { useState } from 'react'
import { Check, Copy, MessageSquare, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Translations } from '@/locales/en'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  t: Translations
}

export function FeedbackDialog({ open, onOpenChange, t }: FeedbackDialogProps) {
  const [topic, setTopic] = useState<'general' | 'feature' | 'bug'>('general')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopyFeedback = async () => {
    try {
      await navigator.clipboard.writeText(
        `Category: ${topic}\nMessage: ${message.trim() || '(Empty message)'}`
      )
      setCopied(true)
      toast.info(t.feedback.copied)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  const handleSubmitFeedback = () => {
    const topicLabel =
      topic === 'feature'
        ? t.feedback.typeFeature
        : topic === 'bug'
          ? t.feedback.typeBug
          : t.feedback.typeGeneral

    const subject = encodeURIComponent(`NutraFlux Feedback: [${topicLabel}]`)
    const body = encodeURIComponent(
      `Category: ${topicLabel}\n\nMessage:\n${message.trim() || '(No message entered)'}\n\n---\nSent from NutraFlux Web App`
    )

    // Open user's default email client
    window.open(`mailto:contact@webilo.dev?subject=${subject}&body=${body}`, '_blank')

    toast.success(t.feedback.thankYouToast)
    setMessage('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-(--border-strong) bg-(--surface-elevated) p-6 sm:p-7 shadow-(--shadow-lift)">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5 text-(--tone-strong)">
            <div className="flex size-9 items-center justify-center rounded-xl bg-(--tone-soft-surface) text-(--tone-strong) shadow-xs">
              <MessageSquare className="size-5" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-(--foreground)">
              {t.feedback.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm leading-relaxed text-(--muted-foreground)">
            {t.feedback.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
              {t.feedback.typeLabel}
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTopic('general')}
                className={`rounded-2xl border px-2.5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-center ${
                  topic === 'general'
                    ? 'border-(--tone-strong) bg-(--tone-soft-surface) text-(--tone-strong) shadow-xs ring-1 ring-(--tone-strong)/20'
                    : 'border-(--border-soft) bg-(--surface-subtle) text-(--muted-foreground) hover:border-(--border-strong) hover:text-(--foreground)'
                }`}
              >
                {t.feedback.typeGeneral.split('/')[0].trim()}
              </button>
              <button
                type="button"
                onClick={() => setTopic('feature')}
                className={`rounded-2xl border px-2.5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-center ${
                  topic === 'feature'
                    ? 'border-(--tone-strong) bg-(--tone-soft-surface) text-(--tone-strong) shadow-xs ring-1 ring-(--tone-strong)/20'
                    : 'border-(--border-soft) bg-(--surface-subtle) text-(--muted-foreground) hover:border-(--border-strong) hover:text-(--foreground)'
                }`}
              >
                {t.feedback.typeFeature}
              </button>
              <button
                type="button"
                onClick={() => setTopic('bug')}
                className={`rounded-2xl border px-2.5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-center ${
                  topic === 'bug'
                    ? 'border-(--tone-strong) bg-(--tone-soft-surface) text-(--tone-strong) shadow-xs ring-1 ring-(--tone-strong)/20'
                    : 'border-(--border-soft) bg-(--surface-subtle) text-(--muted-foreground) hover:border-(--border-strong) hover:text-(--foreground)'
                }`}
              >
                {t.feedback.typeBug}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-(--muted-foreground)">
                {t.feedback.messageLabel}
              </label>
              <span className="text-[11px] text-(--muted-foreground)">
                {message.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.feedback.messagePlaceholder}
              className="mt-2 w-full resize-none rounded-2xl border border-(--border-strong) bg-(--surface-subtle) p-3.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) focus:border-(--tone-strong) focus:ring-2 focus:ring-(--tone-strong)/20 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-(--border-soft) pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyFeedback}
            className="rounded-full text-xs font-semibold text-(--muted-foreground) hover:text-(--foreground)"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 size-3.5 text-(--tone-strong)" />
                {t.feedback.copied}
              </>
            ) : (
              <>
                <Copy className="mr-1.5 size-3.5" />
                {t.feedback.copyButton}
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-full font-semibold"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmitFeedback}
              className="rounded-full bg-(--tone-strong) font-bold text-white shadow-sm shadow-(--tone-strong)/25 hover:bg-(--tone-strong)/90 active:scale-95 transition-all"
            >
              <Send className="mr-1.5 size-3.5" />
              {t.feedback.submitButton}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
