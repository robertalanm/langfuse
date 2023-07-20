import Header from "@/src/components/layouts/header";
import { api } from "@/src/utils/api";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/table/data-table";
import { useRouter } from "next/router";

type WalletTableRow = {
  coldkey: string;
  hotkey: string;
  registered: boolean;
};

export default function Wallets() {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const walletData = api.wallets.getUnique.useQuery({
    projectId,
  });

  const columns: ColumnDef<WalletTableRow>[] = [
    {
      accessorKey: "coldkey",
      header: "Coldkey",
    },
    {
      accessorKey: "hotkey",
      header: "Hotkey",
    },
    {
      accessorKey: "registered",
      header: "Registered",
    },

  ];

  const rows: WalletTableRow[] = walletData.isSuccess
    ? walletData.data.map((wallet) => ({
        coldkey: wallet.coldkey,
        hotkey: wallet.hotkey,
        registered: wallet.registered,
      }))
    : [];

  return (
    <div className="container">
      <div className="flex justify-between">
        <Header title="Wallets" />
      </div>

      <DataTable
        columns={columns}
        data={
          walletData.isLoading
            ? { isLoading: true, isError: false }
            : walletData.isError
            ? {
                isLoading: false,
                isError: true,
                error: walletData.error.message,
              }
            : {
                isLoading: false,
                isError: false,
                data: rows,
              }
        }
        options={{ isLoading: true, isError: false }}
      />

    </div>
  );
}
