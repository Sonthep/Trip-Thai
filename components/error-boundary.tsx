"use client"

import { Component, type ReactNode } from "react"

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex items-center justify-center py-16 text-sm text-white/30">
          ไม่สามารถโหลดส่วนนี้ได้ กรุณารีเฟรชหน้า
        </div>
      )
    }
    return this.props.children
  }
}
