import type { ReactNode } from 'react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import type { SensorData } from '@/types/irrigation'

interface PageHeaderProps {
  title: string
  description: string
  sensorData: SensorData
  action?: ReactNode
}

export function PageHeader({ title, description, sensorData, action }: PageHeaderProps) {
  return (
    <>
      <DashboardHeader sensorData={sensorData} />
      <div className="border-b px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {action}
        </div>
      </div>
    </>
  )
}
