import * as XLSX from "xlsx";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi"; // o donde lo tengas

const ExportExcelButton = ({ data }) => {
  const handleExport = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // Mapear datos para solo incluir las columnas que queremos
    const exportData = data.map((log) => ({
      CodigoGestion: log.CodigoGestion,
      Detalle: log.Detalle,
      Entrada: log.Entrada ? log.Entrada.slice(0, 500) + "..." : "",
      CreatedDate: new Date(log.CreatedDate).toLocaleString(),
    }));

    // Crear hoja de Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    // Descargar
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "datos.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PiMicrosoftExcelLogoFill
      style={{
        cursor: "pointer",
        fontSize: "38px",
        backgroundColor: "#217346",
        color: "#fff",
        borderRadius: "5px",
        padding: "5px",
      }}
      title="Exportar a Excel"
      onClick={handleExport}
    />
  );
};

export default ExportExcelButton;
