import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Table } from "antd";

import { fetcher } from "../utils/fetcher";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";

type Beer = {
  id: string;
  name: string;
  first_brewed: string;
};

type QueryState = {
  page: number | string;
  per_page: number | string;
};

const BeersPage: React.FC = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();

  const [query, setQuery] = useState<QueryState>({
    page: queryParams.get("page") ?? 1,
    per_page: queryParams.get("per_page") ?? 10,
  });

  const { data, isLoading, error } = useSWR(
    `https://api.punkapi.com/v2/beers?${queryParams.toString()}`,
    fetcher
  );

  useEffect(() => {
    const { page, per_page } = query;
    const params = new URLSearchParams();
    if (page) {
      params.append("page", String(page));
    }
    if (per_page) {
      params.append("per_page", String(per_page));
    }

    navigate("/?" + params.toString(), { replace: true });
  }, [navigate, query]);

  if (error) {
    return <>Error</>;
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  const handlePagination = (event: TablePaginationConfig) => {
    const { current, pageSize } = event;
    setQuery({
      ...query,
      page: current ?? 1,
      per_page: pageSize ?? 10,
    });
  };

  const columns: ColumnsType<Beer> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <>{id}</>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <>{name}</>,
    },
    {
      title: "First Brewd",
      dataIndex: "first_brewed",
      key: "first_brewed",
      render: (first_brewed) => <>{first_brewed}</>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        current: +query.page,
        showSizeChanger: true,
        pageSize: +query.per_page,
        total: 100,
      }}
      onChange={handlePagination}
    />
  );
};

export default BeersPage;
