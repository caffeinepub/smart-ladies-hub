import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ImageIcon,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X as XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Offer, Product, StoreConfig } from "./backend.d";
import { Category } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  title: "",
  icon: "✨",
  description: "",
  isActive: true,
  category: Category.ladies,
  badge: "",
  imageUrl: "",
};

const EMPTY_OFFER: Omit<Offer, "id"> = {
  title: "",
  discountText: "",
  description: "",
  isActive: true,
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: Category.ladies, label: "Ladies Collection" },
  { value: Category.accessories, label: "Accessories" },
  { value: Category.jewellery, label: "Jewellery" },
  { value: Category.daily, label: "Daily Use" },
  { value: Category.offer, label: "Offers" },
];

export default function AdminPage() {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [adminAssigned, setAdminAssigned] = useState<boolean | null>(null);
  const [claimingAdmin, setClaimingAdmin] = useState(false);

  // Store config state
  const [config, setConfig] = useState<StoreConfig>({
    whatsapp: "",
    announcement: "",
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] =
    useState<Omit<Product, "id">>(EMPTY_PRODUCT);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offerDialog, setOfferDialog] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState<Omit<Offer, "id">>(EMPTY_OFFER);
  const [savingOffer, setSavingOffer] = useState(false);

  const isLoggedIn = !!identity;

  // Prevent pull-to-refresh on mobile browsers
  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overscrollBehavior = "";
    };
  }, []);

  // Check admin status when actor is ready and user is logged in
  useEffect(() => {
    if (!actor || !isLoggedIn || isFetching) return;
    setCheckingAdmin(true);
    Promise.all([actor.isCallerAdmin(), (actor as any).isAdminAssigned()])
      .then(([callerIsAdmin, assigned]) => {
        setIsAdmin(callerIsAdmin);
        setAdminAssigned(assigned);
        if (callerIsAdmin) {
          loadAll(actor);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setAdminAssigned(true);
      })
      .finally(() => setCheckingAdmin(false));
  }, [actor, isLoggedIn, isFetching]);

  function loadAll(a: typeof actor) {
    if (!a) return;
    Promise.all([
      a.getStoreConfig().then((cfg) => setConfig(cfg)),
      loadProducts(a),
      loadOffers(a),
    ]).catch(() => toast.error("Failed to load data"));
  }

  function loadProducts(a: typeof actor) {
    if (!a) return;
    setLoadingProducts(true);
    return a
      .getProducts()
      .then(setProducts)
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoadingProducts(false));
  }

  function loadOffers(a: typeof actor) {
    if (!a) return;
    setLoadingOffers(true);
    return a
      .getOffers()
      .then(setOffers)
      .catch(() => toast.error("Failed to load offers"))
      .finally(() => setLoadingOffers(false));
  }

  async function handleClaimAdmin() {
    if (!actor) return;
    setClaimingAdmin(true);
    try {
      const success = await (actor as any).claimFirstAdmin();
      if (success) {
        toast.success("Admin access claimed successfully!");
        setIsAdmin(true);
        loadAll(actor);
      } else {
        toast.error("Could not claim admin access. Try again.");
      }
    } catch {
      toast.error("Error claiming admin access. Please try again.");
    } finally {
      setClaimingAdmin(false);
    }
  }

  async function handleSaveConfig() {
    if (!actor) return;
    setSavingConfig(true);
    try {
      await actor.updateStoreConfig(config);
      toast.success("Store config saved!");
    } catch {
      toast.error("Failed to save config");
    } finally {
      setSavingConfig(false);
    }
  }

  function openAddProduct() {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setProductDialog(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      icon: p.icon,
      description: p.description,
      isActive: p.isActive,
      category: p.category,
      badge: p.badge ?? "",
      imageUrl: p.imageUrl ?? "",
    });
    setProductDialog(true);
  }

  async function handleImageUpload(file: File) {
    setUploadProgress(0);
    setUploadError("");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      // Dynamic import to avoid static type errors - @icp-sdk/blob-storage installed at runtime
      // eslint-disable-next-line
      const bsUrl = "@icp-sdk/blob-storage";
      // eslint-disable-next-line
      const mod = (await import(/* @vite-ignore */ bsUrl)) as any;
      const externalBlob = mod.ExternalBlob.fromBytes(bytes).withUploadProgress(
        (pct: number) => setUploadProgress(Math.round(pct)),
      );
      await externalBlob.getBytes();
      const url = externalBlob.getDirectURL();
      setProductForm((p) => ({ ...p, imageUrl: url }));
      setUploadProgress(null);
    } catch (_err) {
      setUploadError("Upload failed. Please try again.");
      setUploadProgress(null);
    }
  }

  async function handleSaveProduct() {
    if (!actor) return;
    setSavingProduct(true);
    try {
      if (editingProduct) {
        await actor.updateProduct({ ...productForm, id: editingProduct.id });
        toast.success("Product updated!");
      } else {
        await actor.addProduct({ ...productForm, id: BigInt(0) });
        toast.success("Product added!");
      }
      setProductDialog(false);
      loadProducts(actor);
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDeleteProduct(id: bigint) {
    if (!actor) return;
    if (!confirm("Delete this product?")) return;
    try {
      await actor.deleteProduct(id);
      toast.success("Product deleted");
      loadProducts(actor);
    } catch {
      toast.error("Failed to delete product");
    }
  }

  function openAddOffer() {
    setEditingOffer(null);
    setOfferForm(EMPTY_OFFER);
    setOfferDialog(true);
  }

  function openEditOffer(o: Offer) {
    setEditingOffer(o);
    setOfferForm({
      title: o.title,
      discountText: o.discountText,
      description: o.description,
      isActive: o.isActive,
    });
    setOfferDialog(true);
  }

  async function handleSaveOffer() {
    if (!actor) return;
    setSavingOffer(true);
    try {
      if (editingOffer) {
        await actor.updateOffer({ ...offerForm, id: editingOffer.id });
        toast.success("Offer updated!");
      } else {
        await actor.addOffer({ ...offerForm, id: BigInt(0) });
        toast.success("Offer added!");
      }
      setOfferDialog(false);
      loadOffers(actor);
    } catch {
      toast.error("Failed to save offer");
    } finally {
      setSavingOffer(false);
    }
  }

  async function handleDeleteOffer(id: bigint) {
    if (!actor) return;
    if (!confirm("Delete this offer?")) return;
    try {
      await actor.deleteOffer(id);
      toast.success("Offer deleted");
      loadOffers(actor);
    } catch {
      toast.error("Failed to delete offer");
    }
  }

  if (isInitializing || (isLoggedIn && (isFetching || checkingAdmin))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-maroon mx-auto" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Toaster />
        <Card className="w-full max-w-sm shadow-xl border-border">
          <CardHeader className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-maroon flex items-center justify-center mx-auto">
              <span className="text-gold text-2xl">💎</span>
            </div>
            <CardTitle className="font-display text-maroon text-xl tracking-wide">
              Smart Ladies Hub
            </CardTitle>
            <CardDescription>
              Admin Panel — Store owner access only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-maroon hover:bg-maroon-mid text-white"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="admin.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login to Admin Panel"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Uses Internet Identity for secure authentication
            </p>
            <div className="pt-1">
              <a
                href="/"
                className="text-xs text-muted-foreground hover:text-maroon transition-colors underline-offset-4 hover:underline"
              >
                ← Back to Store
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // First-time setup: logged in but no admin assigned yet
  if (isAdmin === false && adminAssigned === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Toaster />
        <Card className="w-full max-w-sm shadow-xl border-border">
          <CardHeader className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-maroon flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7 text-gold" />
            </div>
            <CardTitle className="font-display text-maroon text-xl tracking-wide">
              Pehli Baar Setup / First-time Setup
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Abhi tak koi admin set nahi hua hai. Aap pehle admin ban sakte
              hain!
              <br />
              <span className="text-muted-foreground/70">
                No admin has been set up yet. You can claim admin access.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3">
              <p className="text-xs text-maroon font-medium">
                ⚠️ Dhyan dein / Note: Ek baar admin claim karne ke baad, sirf
                wahi admin panel use kar sakta hai.
              </p>
            </div>
            <Button
              className="w-full bg-maroon hover:bg-maroon-mid text-white"
              onClick={handleClaimAdmin}
              disabled={claimingAdmin}
              data-ocid="admin.primary_button"
            >
              {claimingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Claim Admin Access
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={clear}
              data-ocid="admin.cancel_button"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <a
              href="/"
              className="block text-center text-xs text-muted-foreground hover:text-maroon transition-colors underline-offset-4 hover:underline"
            >
              ← Back to Store
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Toaster />
        <Card className="w-full max-w-sm shadow-xl border-border">
          <CardHeader className="text-center space-y-2">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              Your account does not have admin access. Please contact the store
              owner to grant you access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={clear}
              data-ocid="admin.cancel_button"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <a
              href="/"
              className="block text-center text-xs text-muted-foreground hover:text-maroon transition-colors underline-offset-4 hover:underline"
            >
              ← Back to Store
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.isActive).length;
  const activeOffers = offers.filter((o) => o.isActive).length;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Toaster />
      {/* Admin header */}
      <header
        className="bg-maroon text-white sticky top-0 z-50 shadow-lg"
        data-ocid="admin.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-gold/70 hover:text-gold transition-colors text-sm"
            >
              ← Store
            </a>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-2">
              <span className="text-gold text-base">💎</span>
              <span className="font-display font-bold text-gold tracking-widest text-sm uppercase">
                Admin Panel
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-white/70 hover:text-white hover:bg-white/10"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList
            className="bg-muted border border-border"
            data-ocid="admin.tab"
          >
            <TabsTrigger value="overview" data-ocid="admin.tab">
              Overview
            </TabsTrigger>
            <TabsTrigger value="config" data-ocid="admin.tab">
              Store Config
            </TabsTrigger>
            <TabsTrigger value="products" data-ocid="admin.tab">
              Products
            </TabsTrigger>
            <TabsTrigger value="offers" data-ocid="admin.tab">
              Offers
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="border-border">
                  <CardContent className="pt-5 pb-4">
                    <div className="text-3xl font-bold text-maroon">
                      {products.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total Products
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="pt-5 pb-4">
                    <div className="text-3xl font-bold text-maroon">
                      {activeProducts}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Active Products
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="pt-5 pb-4">
                    <div className="text-3xl font-bold text-maroon">
                      {offers.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total Offers
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="pt-5 pb-4">
                    <div className="text-3xl font-bold text-maroon">
                      {activeOffers}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Active Offers
                    </div>
                  </CardContent>
                </Card>
              </div>

              {config.announcement && (
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-maroon">
                      Current Announcement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground bg-beige rounded-lg px-4 py-3 border border-border">
                      {config.announcement}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Store Config Tab */}
          <TabsContent value="config">
            <Card className="border-border max-w-xl">
              <CardHeader>
                <CardTitle className="text-maroon font-display">
                  Store Configuration
                </CardTitle>
                <CardDescription>
                  Update announcement banner and WhatsApp contact number.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="announcement">Announcement Banner</Label>
                  <Textarea
                    id="announcement"
                    placeholder="e.g. New collection arrived! Order now on WhatsApp."
                    value={config.announcement}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        announcement: e.target.value,
                      }))
                    }
                    rows={3}
                    data-ocid="config.textarea"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to hide the announcement banner.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    placeholder="919881293029"
                    value={config.whatsapp}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        whatsapp: e.target.value,
                      }))
                    }
                    data-ocid="config.input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Full number with country code, no + (e.g. 919881293029)
                  </p>
                </div>
                <Button
                  className="bg-maroon hover:bg-maroon-mid text-white"
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  data-ocid="config.submit_button"
                >
                  {savingConfig ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Config"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-maroon text-lg">
                  Products
                </h2>
                <Button
                  className="bg-maroon hover:bg-maroon-mid text-white"
                  size="sm"
                  onClick={openAddProduct}
                  data-ocid="products.open_modal_button"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Product
                </Button>
              </div>

              {loadingProducts ? (
                <div
                  className="text-center py-10"
                  data-ocid="products.loading_state"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-maroon mx-auto" />
                </div>
              ) : products.length === 0 ? (
                <div
                  className="text-center py-14 text-muted-foreground text-sm border border-dashed rounded-xl"
                  data-ocid="products.empty_state"
                >
                  No products yet. Add your first product.
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table data-ocid="products.table">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Icon</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Badge</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p, i) => (
                        <TableRow
                          key={String(p.id)}
                          data-ocid={`products.item.${i + 1}`}
                        >
                          <TableCell>
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-8 h-8 rounded object-cover border border-border"
                              />
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-xl">{p.icon}</TableCell>
                          <TableCell className="font-medium">
                            {p.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs border-border"
                            >
                              {CATEGORIES.find((c) => c.value === p.category)
                                ?.label ?? p.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {p.badge ? (
                              <Badge className="bg-gold/20 text-maroon border-gold/40 text-xs">
                                {p.badge}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                p.isActive
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-muted text-muted-foreground border-border"
                              }
                            >
                              {p.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                onClick={() => openEditProduct(p)}
                                data-ocid={`products.edit_button.${i + 1}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteProduct(p.id)}
                                data-ocid={`products.delete_button.${i + 1}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Product Dialog */}
            <Dialog open={productDialog} onOpenChange={setProductDialog}>
              <DialogContent className="max-w-md" data-ocid="products.dialog">
                <DialogHeader>
                  <DialogTitle className="text-maroon font-display">
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label>Icon</Label>
                      <Input
                        value={productForm.icon}
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            icon: e.target.value,
                          }))
                        }
                        className="text-center text-xl"
                        maxLength={4}
                        data-ocid="products.input"
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label>Title</Label>
                      <Input
                        value={productForm.title}
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g. Silk Sarees"
                        data-ocid="products.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Short description..."
                      rows={2}
                      data-ocid="products.textarea"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Photo</Label>
                    {productForm.imageUrl ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={productForm.imageUrl}
                          alt="Product"
                          className="w-16 h-16 rounded-lg object-cover border border-border"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">
                            Photo uploaded ✓
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setProductForm((p) => ({ ...p, imageUrl: "" }))
                            }
                            className="flex items-center gap-1 text-xs text-destructive hover:underline"
                            data-ocid="products.delete_button"
                          >
                            <XIcon className="w-3 h-3" /> Remove photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label
                          htmlFor="product-image-upload"
                          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl px-4 py-5 cursor-pointer hover:border-maroon/50 hover:bg-muted/30 transition-colors"
                          data-ocid="products.dropzone"
                        >
                          <ImageIcon className="w-7 h-7 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload a photo
                          </span>
                          <span className="text-xs text-muted-foreground/60">
                            JPG, PNG, WEBP
                          </span>
                          <input
                            id="product-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            data-ocid="products.upload_button"
                          />
                        </label>
                        {uploadProgress !== null && (
                          <div
                            className="mt-2 space-y-1"
                            data-ocid="products.loading_state"
                          >
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-maroon transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {uploadError && (
                          <p
                            className="mt-1.5 text-xs text-destructive"
                            data-ocid="products.error_state"
                          >
                            {uploadError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(v) =>
                          setProductForm((p) => ({
                            ...p,
                            category: v as Category,
                          }))
                        }
                      >
                        <SelectTrigger data-ocid="products.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Badge (optional)</Label>
                      <Input
                        value={productForm.badge}
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            badge: e.target.value,
                          }))
                        }
                        placeholder="e.g. NEW 🔥"
                        data-ocid="products.input"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={productForm.isActive}
                      onCheckedChange={(v) =>
                        setProductForm((p) => ({ ...p, isActive: v }))
                      }
                      data-ocid="products.switch"
                    />
                    <Label>Active (visible on store)</Label>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setProductDialog(false)}
                    data-ocid="products.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-maroon hover:bg-maroon-mid text-white"
                    onClick={handleSaveProduct}
                    disabled={savingProduct || !productForm.title}
                    data-ocid="products.submit_button"
                  >
                    {savingProduct ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {savingProduct ? "Saving..." : "Save Product"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-maroon text-lg">
                  Offers
                </h2>
                <Button
                  className="bg-maroon hover:bg-maroon-mid text-white"
                  size="sm"
                  onClick={openAddOffer}
                  data-ocid="offers.open_modal_button"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Offer
                </Button>
              </div>

              {loadingOffers ? (
                <div
                  className="text-center py-10"
                  data-ocid="offers.loading_state"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-maroon mx-auto" />
                </div>
              ) : offers.length === 0 ? (
                <div
                  className="text-center py-14 text-muted-foreground text-sm border border-dashed rounded-xl"
                  data-ocid="offers.empty_state"
                >
                  No offers yet. Add your first offer.
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table data-ocid="offers.table">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Title</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offers.map((o, i) => (
                        <TableRow
                          key={String(o.id)}
                          data-ocid={`offers.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {o.title}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gold/20 text-maroon border-gold/40 text-xs">
                              {o.discountText}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                            {o.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                o.isActive
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-muted text-muted-foreground border-border"
                              }
                            >
                              {o.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                onClick={() => openEditOffer(o)}
                                data-ocid={`offers.edit_button.${i + 1}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteOffer(o.id)}
                                data-ocid={`offers.delete_button.${i + 1}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Offer Dialog */}
            <Dialog open={offerDialog} onOpenChange={setOfferDialog}>
              <DialogContent className="max-w-md" data-ocid="offers.dialog">
                <DialogHeader>
                  <DialogTitle className="text-maroon font-display">
                    {editingOffer ? "Edit Offer" : "Add Offer"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1">
                    <Label>Title</Label>
                    <Input
                      value={offerForm.title}
                      onChange={(e) =>
                        setOfferForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="e.g. Diwali Special Combo"
                      data-ocid="offers.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Discount Text</Label>
                    <Input
                      value={offerForm.discountText}
                      onChange={(e) =>
                        setOfferForm((p) => ({
                          ...p,
                          discountText: e.target.value,
                        }))
                      }
                      placeholder="e.g. 30% OFF"
                      data-ocid="offers.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                      value={offerForm.description}
                      onChange={(e) =>
                        setOfferForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Offer details..."
                      rows={2}
                      data-ocid="offers.textarea"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={offerForm.isActive}
                      onCheckedChange={(v) =>
                        setOfferForm((p) => ({ ...p, isActive: v }))
                      }
                      data-ocid="offers.switch"
                    />
                    <Label>Active (visible on store)</Label>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOfferDialog(false)}
                    data-ocid="offers.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-maroon hover:bg-maroon-mid text-white"
                    onClick={handleSaveOffer}
                    disabled={savingOffer || !offerForm.title}
                    data-ocid="offers.submit_button"
                  >
                    {savingOffer ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {savingOffer ? "Saving..." : "Save Offer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
