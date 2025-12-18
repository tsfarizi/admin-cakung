import { useState, useRef, useEffect } from "react";
import "./StrukturAdmin.css";
import logo from "../assets/logo.png";

/* ================= NODE ================= */
const Node = ({ data, className, onClick }) => {
  return (
    <div className={`node ${className}`} onClick={() => onClick(data)}>
      <div className="photo">
        {data.photo ? <img src={data.photo} /> : "foto"}
      </div>
      <div className="info">
        <div className="name">{data.name}</div>
        <div className="title">{data.title}</div>
      </div>
    </div>
  );
};

/* ================= MODAL ================= */
const EditModal = ({ data, onClose, onSave }) => {
  const fileRef = useRef();
  const [name, setName] = useState(data.name);
  const [title, setTitle] = useState(data.title);
  const [photo, setPhoto] = useState(data.photo);

  const upload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Data</h3>

        <label>Nama</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Jabatan</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Foto</label>
        <div className="upload-box" onClick={() => fileRef.current.click()}>
          {photo ? <img src={photo} /> : "Upload Foto"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={upload}
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn-delete"
            onClick={() => onSave({ ...data, _delete: true })}
          >
            Hapus
          </button>
          <button className="btn-cancel" onClick={onClose}>Batal</button>
          <button
            className="btn-save"
            onClick={() => onSave({ ...data, name, title, photo })}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN ================= */
export default function StrukturAdmin() {
  const [nodes, setNodes] = useState([
    { id: "lurah", name: "", title: "", photo: "" },

    { id: "sekretaris", name: "Hariyanti", title: "SEKRETARIS KELURAHAN", photo: "" },
    { id: "bendahara", name: "Sestia Akbarani", title: "BENDAHARA", photo: "" },
    { id: "pengurus", name: "Rosemillah Lase", title: "PENGURUS BARANG", photo: "" },

    { id: "kasipemerintahan", name: "Ricki Sugiarto", title: "KASI PEMERINTAHAN", photo: "" },
    { id: "kasiekopem", name: "", title: "KASI EKONOMI PEMBANGUNAN", photo: "" },
    { id: "plkb", name: "Tri Hastuti", title: "KASI KESEJAHTERAAN RAKYAT", photo: "" },
    { id: "gulkarmat", name: "Mufti Ashari", title: "STAF PEMERINTAHAN", photo: "" },
    { id: "satpolpp", name: "Indra Sukaca", title: "STAF EKONOMI PEMBANGUNAN", photo: "" },
    { id: "ptsp", name: "Anttonius Kharisma", title: "STAF KESEJAHTERAAN RAKYAT", photo: "" },

    { id: "kesejahteraan", name: "", title: "", photo: "" },
    { id: "pemerintahan", name: "", title: "", photo: "" },
    { id: "ekonomi", name: "", title: "", photo: "" },

    { id: "staf-dwiana", name: "", title: "", photo: "" },
    { id: "staf-agus", name: "", title: "", photo: "" },
    { id: "staf-emma", name: "", title: "", photo: "" }
  ]);

  const [active, setActive] = useState(null);

  /* =====================================================
     API READ (GET) — ambil data dari backend
     ===================================================== */
  useEffect(() => {
    fetch("https://cakung-barat-server-1065513777845.asia-southeast2.run.app/api/organization")
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) return;

        const lurah = data[0];

        setNodes(prev =>
          prev.map(n =>
            n.id === "lurah"
              ? {
                  ...n,
                  name: lurah.name,
                  title: lurah.position,
                  photo: lurah.photo
                }
              : n
          )
        );
      })
      .catch(err => console.error("API GET error:", err));
  }, []);

  /* =====================================================
     API UPDATE (PUT) — hanya node lurah
     ===================================================== */
  const saveNode = (updated) => {

  /* ===== DELETE API ===== */
  if (updated._delete && updated.id === "lurah") {
    fetch(
      "https://cakung-barat-server-1065513777845.asia-southeast2.run.app/api/organization/1",
      {
        method: "DELETE"
      }
    )
      .then(() => {
        setNodes(prev =>
          prev.map(n =>
            n.id === "lurah"
              ? { ...n, name: "", title: "", photo: "" }
              : n
          )
        );
      })
      .catch(err => console.error("API DELETE error:", err));

    setActive(null);
    return;
  }

  /* ===== UPDATE API ===== */
  if (updated.id === "lurah") {
    fetch(
      "https://cakung-barat-server-1065513777845.asia-southeast2.run.app/api/organization/1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updated.name,
          position: updated.title,
          photo: updated.photo
        })
      }
    ).catch(err => console.error("API PUT error:", err));
  }

  setNodes(prev => prev.map(n => n.id === updated.id ? updated : n));
  setActive(null);
};


  const getNode = (id) => nodes.find(n => n.id === id);

  return (
    <div className="container">
      <img src={logo} className="logo" />
      <h1>STRUKTUR ORGANISASI KELURAHAN CAKUNG BARAT</h1>

      <div className="chart-scroll">
        <div className="org-chart">

          <Node className="node-lurah" data={getNode("lurah")} onClick={setActive} />

          <Node className="node-sekretaris" data={getNode("sekretaris")} onClick={setActive} />
          <Node className="node-bendahara" data={getNode("bendahara")} onClick={setActive} />
          <Node className="node-pengurus" data={getNode("pengurus")} onClick={setActive} />

          <Node className="node-kasipemerintahan" data={getNode("kasipemerintahan")} onClick={setActive} />
          <Node className="node-kasiekopem" data={getNode("kasiekopem")} onClick={setActive} />
          <Node className="node-plkb" data={getNode("plkb")} onClick={setActive} />
          <Node className="node-gulkarmat" data={getNode("gulkarmat")} onClick={setActive} />
          <Node className="node-satpolpp" data={getNode("satpolpp")} onClick={setActive} />
          <Node className="node-ptsp" data={getNode("ptsp")} onClick={setActive} />

          <Node className="node-kesejahteraan" data={getNode("kesejahteraan")} onClick={setActive} />
          <Node className="node-pemerintahan" data={getNode("pemerintahan")} onClick={setActive} />
          <Node className="node-ekonomi" data={getNode("ekonomi")} onClick={setActive} />

          <Node className="node-staf-dwiana" data={getNode("staf-dwiana")} onClick={setActive} />
          <Node className="node-staf-agus" data={getNode("staf-agus")} onClick={setActive} />
          <Node className="node-staf-emma" data={getNode("staf-emma")} onClick={setActive} />

          <div className="lines">
            {[
              "line-1","line-2","line-3","line-4","line-5","line-6",
              "line-7","line-8","line-9","line-10",
              "line-11-kasipemerintahan","line-11-kasiekopem","line-11-plkb",
              "line-11-gulkarmat","line-11-satpolpp","line-11-ptsp",
              "line-13","line-15","line-12","line-14",
              "line-16","line-17",
              "line-18-dwiana","line-18-agus","line-18-emma"
            ].map(l => <div key={l} className={`line ${l}`} />)}
          </div>

        </div>
      </div>

      {active && (
        <EditModal
          data={active}
          onClose={() => setActive(null)}
          onSave={saveNode}
        />
      )}
    </div>
  );
}
