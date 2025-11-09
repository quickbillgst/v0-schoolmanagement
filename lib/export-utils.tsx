export interface ExportOptions {
  filename?: string
}

export function exportToCSV<T extends Record<string, any>>(data: T[], filename = "export.csv"): void {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  // Get all keys from all objects
  const allKeys = Array.from(new Set(data.flatMap((obj) => Object.keys(obj))))

  // Create CSV header
  const header = allKeys.map((key) => `"${key}"`).join(",")

  // Create CSV rows
  const rows = data.map((obj) =>
    allKeys
      .map((key) => {
        let value = obj[key]

        // Handle nested objects
        if (typeof value === "object" && value !== null) {
          if (value._id) {
            value = value._id
          } else {
            value = JSON.stringify(value)
          }
        }

        // Escape quotes and handle strings
        value = String(value).replace(/"/g, '""')
        return `"${value}"`
      })
      .join(","),
  )

  const csv = [header, ...rows].join("\n")

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportAnalyticsReport(stats: Record<string, any>, filename = "analytics-report.csv"): void {
  const data = Object.entries(stats).map(([key, value]) => ({
    Metric: key,
    Value: value,
  }))

  exportToCSV(data, filename)
}

export function generatePrintableReport(title: string, content: string): void {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const date = new Date().toLocaleDateString()

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #1f2937;
          }
          .date {
            color: #6b7280;
            font-size: 14px;
          }
          .content {
            line-height: 1.6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p class="date">Generated on ${date}</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <script>
          window.print();
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
