// src/app/services/navigationService.ts
import { useRouter } from "next/navigation";

// This is a singleton pattern to store the router instance
let routerInstance: ReturnType<typeof useRouter> | null = null;

export const registerRouter = (router: ReturnType<typeof useRouter>) => {
  routerInstance = router;
};

export const navigate = (path: string) => {
  if (routerInstance) {
    routerInstance.push(path);
  } else {
    console.warn("Router not registered. Navigation not possible.");
  }
};
