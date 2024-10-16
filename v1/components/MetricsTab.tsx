import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList,TabsTrigger} from "@/components/ui/tabs"
import React from "react"
import { AccountChart } from "./AccountChart"
import { CustomCardProps, MetricsTabProps } from "@/types/types"
import { fetchTradePages, getAccountDetails, getAllTrades } from "@/lib/actions"
import { PLChart } from "./PLChart"
import { BarChartPL } from "./BarChart"
import Pagination from "./Pagination"

export async function MetricsTab({ query, currentPage} : MetricsTabProps) {
  const [account, trades, totalPages] = await Promise.all([
    getAccountDetails(), getAllTrades(currentPage), fetchTradePages(query)
  ])
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-slate-600 text-gray-300">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tradeLog">Trade Log</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="flex flex-col space-y-3 w-full">
        <div className="flex space-x-2 w-full">
          <CustomCard value={account!.accountBalance} label="Balance (USD)"/>
          <CustomCard value={account!.totalProfit} label="Profit (USD)" />
          <CustomCard value={account!.averageProfitLossRatio} label="Average P/L"/>
          <CustomCard value={account!.totalTrades} label="Total Trades"/>
        </div>
        <div className="flex gap-3">
          <AccountChart/>
          {/* <PLChart/> */}
          <BarChartPL/>
        </div>
      </TabsContent>
      <TabsContent value="tradeLog">
        <Card className="w-full h-full flex flex-col p-4 px-6 space-y-2 bg-slate-900 border-none">
          <div className="flex justify-between font-medium my-2 text-white">
            <h1>Currency Pair</h1>
            <h1>Order Type</h1>
            <h1>Result</h1>
            <h1>Amount (USD)</h1>
            <h1>Lot Size</h1>
            <h1>Date</h1>
          </div>
          {trades.map((trade) => (
            <div key={trade.id} className="flex justify-between items-center border-b p-[6px] border-slate-700">
              <div className="text-gray-300">{trade.currencyPair}</div>
              <div className="text-gray-400">
                {trade.type.charAt(0).toUpperCase() + trade.type.slice(1).toLowerCase()}
              </div>
              <div className={`font-medium ${trade.result.toLowerCase() === 'profit' ? 'text-green-400' : 
                trade.result.toLowerCase() === 'loss' ? 'text-red-500' : 'text-gray-500'}`}>
                {trade.result.charAt(0).toUpperCase() + trade.result.slice(1).toLowerCase()}
              </div>
              <div className="text-violet-400 flex place-items-start">{(trade.amount / 100).toFixed(2)}</div>
              <div className="text-gray-400">{trade.lotSize}</div>
              <div className="text-gray-400">{trade.createdAt ? new Date(trade.createdAt).toLocaleDateString('en-GB') : 'N/A'}</div>
            </div>
          ))}
          <div className="flex items-center my-1">
            <Pagination  totalPages={totalPages}/>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">

      </TabsContent>
    </Tabs>
  )
}

const CustomCard:React.FC<CustomCardProps> = ({label, value, icon, comment}) => {
    return (
      <Card className="grid items-center bg-slate-900 border-none">
          <CardHeader>
              <CardTitle className="text-main-700">{label}</CardTitle>
          </CardHeader>
          <CardContent>
              <div>
                  <h1 className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-pink-400 flex items-center text-2xl">{value}<span className="mx-1"></span></h1>
              </div>
          </CardContent>
          <CardFooter>
              <p>{comment}</p>
          </CardFooter>
      </Card>
    )
}