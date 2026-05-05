// src/utils/events.ts

// 1. 定义明确的事件类型映射（可选，但推荐用于大型项目）
export interface EventMap {
  'code-block-hover': boolean; // 明确 payload 是 boolean
  'theme-tooltip': void;       // 如果没有 payload
}

// 2. 使用泛型增强类型安全
type EventCallback<T = any> = (data: T) => void;
const events = new Map<keyof EventMap | string, Set<EventCallback<any>>>();

export const eventBus = {
  // 3. on 方法支持泛型，确保回调接收到的数据类型正确
  on<K extends keyof EventMap | string>(event: K, callback: EventCallback<EventMap[K]>) {
    if (!events.has(event)) {
      events.set(event, new Set());
    }
    events.get(event)!.add(callback as EventCallback<any>);
    
    // 返回取消订阅函数
    return () => {
      const set = events.get(event);
      if (set) {
        set.delete(callback as EventCallback<any>);
        // 可选：如果集合为空，清理 key以节省内存
        if (set.size === 0) {
          events.delete(event);
        }
      }
    };
  },
  
  emit<K extends keyof EventMap | string>(event: K, data?: EventMap[K]) {
    const callbacks = events.get(event);
    if (callbacks) {
      // 使用 Array.from 防止在遍历过程中修改集合导致的问题
      Array.from(callbacks).forEach(cb => cb(data));
    }
  },
  
  off<K extends keyof EventMap | string>(event: K, callback: EventCallback<EventMap[K]>) {
    const set = events.get(event);
    if (set) {
      set.delete(callback as EventCallback<any>);
      if (set.size === 0) {
        events.delete(event);
      }
    }
  }
};

// 预定义事件名常量（保持兼容旧代码字符串写法）
export const EVENTS = {
  CODE_BLOCK_HOVER: 'code-block-hover',
  THEME_TOOLTIP: 'theme-tooltip'
} as const;