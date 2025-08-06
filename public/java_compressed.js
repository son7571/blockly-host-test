"use strict";
var javaGenerator = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // generators/java/java_generator.ts
  var java_generator_exports = {};
  __export(java_generator_exports, {
    JavaGenerator: () => JavaGenerator,
    Order: () => Order,
    default: () => java_generator_default
  });

  // core/touch.ts
  var TOUCH_ENABLED = "ontouchstart" in globalThis || !!(globalThis["document"] && document.documentElement && "ontouchstart" in document.documentElement) || // IE10 uses non-standard touch events,
  // so it has a different check.
  !!(globalThis["navigator"] && (globalThis["navigator"]["maxTouchPoints"] || globalThis["navigator"]["msMaxTouchPoints"]));

  // core/utils/useragent.ts
  var rawUserAgent;
  var isJavaFx;
  var isWebKit;
  var isGecko;
  var isAndroid;
  var isIPad;
  var isIPhone;
  var isMac;
  var isTablet;
  var isMobile;
  (function(raw) {
    rawUserAgent = raw;
    const rawUpper = rawUserAgent.toUpperCase();
    function has(name) {
      return rawUpper.includes(name.toUpperCase());
    }
    isJavaFx = has("JavaFX");
    isWebKit = has("WebKit");
    isGecko = has("Gecko") && !isWebKit;
    isAndroid = has("Android");
    const maxTouchPoints = globalThis["navigator"] && globalThis["navigator"]["maxTouchPoints"];
    isIPad = has("iPad") || has("Macintosh") && maxTouchPoints > 0;
    isIPhone = has("iPhone") && !isIPad;
    isMac = has("Macintosh");
    isTablet = isIPad || isAndroid && !has("Mobile") || has("Silk");
    isMobile = !isTablet && (isIPhone || isAndroid);
  })(globalThis["navigator"] && globalThis["navigator"]["userAgent"] || "");

  // core/registry.ts
  var Type = class _Type {
    /** @param name The name of the registry type. */
    constructor(name) {
      this.name = name;
    }
    /**
     * Returns the name of the type.
     *
     * @returns The name.
     */
    toString() {
      return this.name;
    }
    static {
      this.CONNECTION_CHECKER = new _Type("connectionChecker");
    }
    static {
      this.CONNECTION_PREVIEWER = new _Type(
        "connectionPreviewer"
      );
    }
    static {
      this.CURSOR = new _Type("cursor");
    }
    static {
      this.EVENT = new _Type("event");
    }
    static {
      this.FIELD = new _Type("field");
    }
    static {
      this.INPUT = new _Type("input");
    }
    static {
      this.RENDERER = new _Type("renderer");
    }
    static {
      this.TOOLBOX = new _Type("toolbox");
    }
    static {
      this.THEME = new _Type("theme");
    }
    static {
      this.TOOLBOX_ITEM = new _Type("toolboxItem");
    }
    static {
      this.FLYOUTS_VERTICAL_TOOLBOX = new _Type("flyoutsVerticalToolbox");
    }
    static {
      this.FLYOUTS_HORIZONTAL_TOOLBOX = new _Type(
        "flyoutsHorizontalToolbox"
      );
    }
    static {
      this.FLYOUT_INFLATER = new _Type("flyoutInflater");
    }
    static {
      this.METRICS_MANAGER = new _Type("metricsManager");
    }
    static {
      /**
       * Type for an IDragger. Formerly behavior was mostly covered by
       * BlockDraggeers, which is why the name is inaccurate.
       */
      this.BLOCK_DRAGGER = new _Type("blockDragger");
    }
    static {
      /** @internal */
      this.SERIALIZER = new _Type("serializer");
    }
    static {
      /** @internal */
      this.ICON = new _Type("icon");
    }
    static {
      /** @internal */
      this.PASTER = new _Type("paster");
    }
    static {
      this.VARIABLE_MODEL = new _Type("variableModel");
    }
    static {
      this.VARIABLE_MAP = new _Type(
        "variableMap"
      );
    }
  };

  // core/utils/dom.ts
  var SVG_NS = "http://www.w3.org/2000/svg";
  function createSvgElement(name, attrs, opt_parent) {
    const e = document.createElementNS(SVG_NS, `${name}`);
    for (const key in attrs) {
      e.setAttribute(key, `${attrs[key]}`);
    }
    if (opt_parent) {
      opt_parent.appendChild(e);
    }
    return e;
  }
  function addClass(element, className) {
    const classNames = className.split(" ");
    if (classNames.every((name) => element.classList.contains(name))) {
      return false;
    }
    element.classList.add(...classNames);
    return true;
  }
  function removeClass(element, className) {
    const classNames = className.split(" ");
    if (classNames.every((name) => !element.classList.contains(name))) {
      return false;
    }
    element.classList.remove(...classNames);
    return true;
  }
  function hasClass(element, className) {
    return element.classList.contains(className);
  }

  // core/utils/focusable_tree_traverser.ts
  var FocusableTreeTraverser = class _FocusableTreeTraverser {
    static {
      this.ACTIVE_CLASS_NAME = "blocklyActiveFocus";
    }
    static {
      this.PASSIVE_CSS_CLASS_NAME = "blocklyPassiveFocus";
    }
    static {
      this.ACTIVE_FOCUS_NODE_CSS_SELECTOR = `.${_FocusableTreeTraverser.ACTIVE_CLASS_NAME}`;
    }
    static {
      this.PASSIVE_FOCUS_NODE_CSS_SELECTOR = `.${_FocusableTreeTraverser.PASSIVE_CSS_CLASS_NAME}`;
    }
    /**
     * Returns the current IFocusableNode that is styled (and thus represented) as
     * having either passive or active focus, only considering HTML and SVG
     * elements.
     *
     * This can match against the tree's root.
     *
     * Note that this will never return a node from a nested sub-tree as that tree
     * should specifically be used to retrieve its focused node.
     *
     * @param tree The IFocusableTree in which to search for a focused node.
     * @returns The IFocusableNode currently with focus, or null if none.
     */
    static findFocusedNode(tree) {
      const rootNode = tree.getRootFocusableNode();
      if (!rootNode.canBeFocused()) return null;
      const root = rootNode.getFocusableElement();
      if (hasClass(root, _FocusableTreeTraverser.ACTIVE_CLASS_NAME) || hasClass(root, _FocusableTreeTraverser.PASSIVE_CSS_CLASS_NAME)) {
        return rootNode;
      }
      const activeEl = root.querySelector(this.ACTIVE_FOCUS_NODE_CSS_SELECTOR);
      if (activeEl instanceof HTMLElement || activeEl instanceof SVGElement) {
        const active = _FocusableTreeTraverser.findFocusableNodeFor(
          activeEl,
          tree
        );
        if (active) return active;
      }
      const passiveEl = root.querySelector(this.PASSIVE_FOCUS_NODE_CSS_SELECTOR);
      if (passiveEl instanceof HTMLElement || passiveEl instanceof SVGElement) {
        const passive = _FocusableTreeTraverser.findFocusableNodeFor(
          passiveEl,
          tree
        );
        if (passive) return passive;
      }
      return null;
    }
    /**
     * Returns the IFocusableNode corresponding to the specified HTML or SVG
     * element iff it's the root element or a descendent of the root element of
     * the specified IFocusableTree.
     *
     * If the element exists within the specified tree's DOM structure but does
     * not directly correspond to a node, the nearest parent node (or the tree's
     * root) will be returned to represent the provided element.
     *
     * If the tree contains another nested IFocusableTree, the nested tree may be
     * traversed but its nodes will never be returned here per the contract of
     * IFocusableTree.lookUpFocusableNode.
     *
     * The provided element must have a non-null, non-empty ID that conforms to
     * the contract mentioned in IFocusableNode.
     *
     * @param element The HTML or SVG element being sought.
     * @param tree The tree under which the provided element may be a descendant.
     * @returns The matching IFocusableNode, or null if there is no match.
     */
    static findFocusableNodeFor(element, tree) {
      if (!element.id || element.id === "null") return null;
      const subTreeMatches = tree.getNestedTrees().map((tree2) => {
        return _FocusableTreeTraverser.findFocusableNodeFor(element, tree2);
      });
      if (subTreeMatches.findIndex((match) => !!match) !== -1) {
        return null;
      }
      const rootNode = tree.getRootFocusableNode();
      if (rootNode.canBeFocused() && element === rootNode.getFocusableElement()) {
        return rootNode;
      }
      const matchedChildNode = tree.lookUpFocusableNode(element.id) ?? null;
      if (matchedChildNode) return matchedChildNode;
      const elementParent = element.parentElement;
      if (!matchedChildNode && elementParent) {
        return _FocusableTreeTraverser.findFocusableNodeFor(elementParent, tree);
      }
      return null;
    }
  };

  // core/focus_manager.ts
  var TreeRegistration = class {
    /**
     * Constructs a new TreeRegistration.
     *
     * @param tree The tree being registered.
     * @param rootShouldBeAutoTabbable Whether the tree should have automatic
     *     top-level tab management.
     */
    constructor(tree, rootShouldBeAutoTabbable) {
      this.tree = tree;
      this.rootShouldBeAutoTabbable = rootShouldBeAutoTabbable;
    }
  };
  var FocusManager = class _FocusManager {
    constructor(addGlobalEventListener) {
      this.focusedNode = null;
      this.previouslyFocusedNode = null;
      this.registeredTrees = [];
      this.currentlyHoldsEphemeralFocus = false;
      this.lockFocusStateChanges = false;
      this.recentlyLostAllFocus = false;
      this.isUpdatingFocusedNode = false;
      const maybeFocus = (element) => {
        if (this.isUpdatingFocusedNode) return;
        this.recentlyLostAllFocus = !element;
        let newNode = null;
        if (element instanceof HTMLElement || element instanceof SVGElement) {
          for (const reg of this.registeredTrees) {
            const tree = reg.tree;
            newNode = FocusableTreeTraverser.findFocusableNodeFor(element, tree);
            if (newNode) break;
          }
        }
        if (newNode && newNode.canBeFocused()) {
          const newTree = newNode.getFocusableTree();
          const oldTree = this.focusedNode?.getFocusableTree();
          if (newNode === newTree.getRootFocusableNode() && newTree !== oldTree) {
            this.focusTree(newTree);
          } else {
            this.focusNode(newNode);
          }
        } else {
          this.defocusCurrentFocusedNode();
        }
      };
      addGlobalEventListener("focusin", (event) => {
        if (!(event instanceof FocusEvent)) return;
        maybeFocus(document.activeElement);
      });
      addGlobalEventListener("focusout", (event) => {
        if (!(event instanceof FocusEvent)) return;
        maybeFocus(event.relatedTarget);
      });
    }
    static {
      /**
       * The CSS class assigned to IFocusableNode elements that presently have
       * active DOM and Blockly focus.
       *
       * This should never be used directly. Instead, rely on FocusManager to ensure
       * nodes have active focus (either automatically through DOM focus or manually
       * through the various focus* methods provided by this class).
       *
       * It's recommended to not query using this class name, either. Instead, use
       * FocusableTreeTraverser or IFocusableTree's methods to find a specific node.
       */
      this.ACTIVE_FOCUS_NODE_CSS_CLASS_NAME = "blocklyActiveFocus";
    }
    static {
      /**
       * The CSS class assigned to IFocusableNode elements that presently have
       * passive focus (that is, they were the most recent node in their relative
       * tree to have active focus--see ACTIVE_FOCUS_NODE_CSS_CLASS_NAME--and will
       * receive active focus again if their surrounding tree is requested to become
       * focused, i.e. using focusTree below).
       *
       * See ACTIVE_FOCUS_NODE_CSS_CLASS_NAME for caveats and limitations around
       * using this constant directly (generally it never should need to be used).
       */
      this.PASSIVE_FOCUS_NODE_CSS_CLASS_NAME = "blocklyPassiveFocus";
    }
    /**
     * Registers a new IFocusableTree for automatic focus management.
     *
     * If the tree currently has an element with DOM focus, it will not affect the
     * internal state in this manager until the focus changes to a new,
     * now-monitored element/node.
     *
     * This function throws if the provided tree is already currently registered
     * in this manager. Use isRegistered to check in cases when it can't be
     * certain whether the tree has been registered.
     *
     * The tree's registration can be customized to configure automatic tab stops.
     * This specifically provides capability for the user to be able to tab
     * navigate to the root of the tree but only when the tree doesn't hold active
     * focus. If this functionality is disabled then the tree's root will
     * automatically be made focusable (but not tabbable) when it is first focused
     * in the same way as any other focusable node.
     *
     * @param tree The IFocusableTree to register.
     * @param rootShouldBeAutoTabbable Whether the root of this tree should be
     *     added as a top-level page tab stop when it doesn't hold active focus.
     */
    registerTree(tree, rootShouldBeAutoTabbable = false) {
      this.ensureManagerIsUnlocked();
      if (this.isRegistered(tree)) {
        throw Error(`Attempted to re-register already registered tree: ${tree}.`);
      }
      this.registeredTrees.push(
        new TreeRegistration(tree, rootShouldBeAutoTabbable)
      );
      const rootElement = tree.getRootFocusableNode().getFocusableElement();
      if (!rootElement.id || rootElement.id === "null") {
        throw Error(
          `Attempting to register a tree with a root element that has an invalid ID: ${tree}.`
        );
      }
      if (rootShouldBeAutoTabbable) {
        rootElement.tabIndex = 0;
      }
    }
    /**
     * Returns whether the specified tree has already been registered in this
     * manager using registerTree and hasn't yet been unregistered using
     * unregisterTree.
     */
    isRegistered(tree) {
      return !!this.lookUpRegistration(tree);
    }
    /**
     * Returns the TreeRegistration for the specified tree, or null if the tree is
     * not currently registered.
     */
    lookUpRegistration(tree) {
      return this.registeredTrees.find((reg) => reg.tree === tree) ?? null;
    }
    /**
     * Unregisters a IFocusableTree from automatic focus management.
     *
     * If the tree had a previous focused node, it will have its highlight
     * removed. This function does NOT change DOM focus.
     *
     * This function throws if the provided tree is not currently registered in
     * this manager.
     *
     * This function will reset the tree's root element tabindex if the tree was
     * registered with automatic tab management.
     */
    unregisterTree(tree) {
      this.ensureManagerIsUnlocked();
      if (!this.isRegistered(tree)) {
        throw Error(`Attempted to unregister not registered tree: ${tree}.`);
      }
      const treeIndex = this.registeredTrees.findIndex(
        (reg) => reg.tree === tree
      );
      const registration = this.registeredTrees[treeIndex];
      this.registeredTrees.splice(treeIndex, 1);
      const focusedNode = FocusableTreeTraverser.findFocusedNode(tree);
      const root = tree.getRootFocusableNode();
      if (focusedNode) this.removeHighlight(focusedNode);
      if (this.focusedNode === focusedNode || this.focusedNode === root) {
        this.updateFocusedNode(null);
      }
      this.removeHighlight(root);
      if (registration.rootShouldBeAutoTabbable) {
        tree.getRootFocusableNode().getFocusableElement().removeAttribute("tabindex");
      }
    }
    /**
     * Returns the current IFocusableTree that has focus, or null if none
     * currently do.
     *
     * Note also that if ephemeral focus is currently captured (e.g. using
     * takeEphemeralFocus) then the returned tree here may not currently have DOM
     * focus.
     */
    getFocusedTree() {
      return this.focusedNode?.getFocusableTree() ?? null;
    }
    /**
     * Returns the current IFocusableNode with focus (which is always tied to a
     * focused IFocusableTree), or null if there isn't one.
     *
     * Note that this function will maintain parity with
     * IFocusableTree.getFocusedNode(). That is, if a tree itself has focus but
     * none of its non-root children do, this will return null but
     * getFocusedTree() will not.
     *
     * Note also that if ephemeral focus is currently captured (e.g. using
     * takeEphemeralFocus) then the returned node here may not currently have DOM
     * focus.
     */
    getFocusedNode() {
      return this.focusedNode;
    }
    /**
     * Focuses the specific IFocusableTree. This either means restoring active
     * focus to the tree's passively focused node, or focusing the tree's root
     * node.
     *
     * Note that if the specified tree already has a focused node then this will
     * not change any existing focus (unless that node has passive focus, then it
     * will be restored to active focus).
     *
     * See getFocusedNode for details on how other nodes are affected.
     *
     * @param focusableTree The tree that should receive active
     *     focus.
     */
    focusTree(focusableTree) {
      this.ensureManagerIsUnlocked();
      if (!this.isRegistered(focusableTree)) {
        throw Error(`Attempted to focus unregistered tree: ${focusableTree}.`);
      }
      const currNode = FocusableTreeTraverser.findFocusedNode(focusableTree);
      const nodeToRestore = focusableTree.getRestoredFocusableNode(currNode);
      const rootFallback = focusableTree.getRootFocusableNode();
      this.focusNode(nodeToRestore ?? currNode ?? rootFallback);
    }
    /**
     * Focuses DOM input on the specified node, and marks it as actively focused.
     *
     * Any previously focused node will be updated to be passively highlighted (if
     * it's in a different focusable tree) or blurred (if it's in the same one).
     *
     * **Important**: If the provided node is not able to be focused (e.g. its
     * canBeFocused() method returns false), it will be ignored and any existing
     * focus state will remain unchanged.
     *
     * Note that this may update the specified node's element's tabindex to ensure
     * that it can be properly read out by screenreaders while focused.
     *
     * @param focusableNode The node that should receive active focus.
     */
    focusNode(focusableNode) {
      this.ensureManagerIsUnlocked();
      const mustRestoreUpdatingNode = !this.currentlyHoldsEphemeralFocus;
      if (mustRestoreUpdatingNode) {
        this.isUpdatingFocusedNode = true;
      }
      const prevFocusedElement = this.focusedNode?.getFocusableElement();
      const hasDesyncedState = prevFocusedElement !== document.activeElement;
      if (this.focusedNode === focusableNode && !hasDesyncedState) {
        if (mustRestoreUpdatingNode) {
          this.isUpdatingFocusedNode = false;
        }
        return;
      }
      if (!focusableNode.canBeFocused()) {
        console.warn("Trying to focus a node that can't be focused.");
        if (mustRestoreUpdatingNode) {
          this.isUpdatingFocusedNode = false;
        }
        return;
      }
      const nextTree = focusableNode.getFocusableTree();
      if (!this.isRegistered(nextTree)) {
        throw Error(`Attempted to focus unregistered node: ${focusableNode}.`);
      }
      const focusableNodeElement = focusableNode.getFocusableElement();
      if (!focusableNodeElement.id || focusableNodeElement.id === "null") {
        console.warn("Trying to focus a node that has an invalid ID.");
      }
      const matchedNode = FocusableTreeTraverser.findFocusableNodeFor(
        focusableNodeElement,
        nextTree
      );
      const prevNodeNextTree = FocusableTreeTraverser.findFocusedNode(nextTree);
      let nodeToFocus = focusableNode;
      if (matchedNode !== focusableNode) {
        const nodeToRestore = nextTree.getRestoredFocusableNode(prevNodeNextTree);
        const rootFallback = nextTree.getRootFocusableNode();
        nodeToFocus = nodeToRestore ?? prevNodeNextTree ?? rootFallback;
      }
      const prevNode = this.focusedNode;
      const prevTree = prevNode?.getFocusableTree();
      if (prevNode) {
        this.passivelyFocusNode(prevNode, nextTree);
      }
      const nextTreeRoot = nextTree.getRootFocusableNode();
      if (prevNodeNextTree) {
        this.removeHighlight(prevNodeNextTree);
      }
      if (nextTreeRoot !== nodeToFocus) {
        this.removeHighlight(nextTreeRoot);
      }
      if (!this.currentlyHoldsEphemeralFocus) {
        this.activelyFocusNode(nodeToFocus, prevTree ?? null);
      }
      this.updateFocusedNode(nodeToFocus);
      if (mustRestoreUpdatingNode) {
        this.isUpdatingFocusedNode = false;
      }
    }
    /**
     * Ephemerally captures focus for a specific element until the returned lambda
     * is called. This is expected to be especially useful for ephemeral UI flows
     * like dialogs.
     *
     * IMPORTANT: the returned lambda *must* be called, otherwise automatic focus
     * will no longer work anywhere on the page. It is highly recommended to tie
     * the lambda call to the closure of the corresponding UI so that if input is
     * manually changed to an element outside of the ephemeral UI, the UI should
     * close and automatic input restored. Note that this lambda must be called
     * exactly once and that subsequent calls will throw an error.
     *
     * Note that the manager will continue to track DOM input signals even when
     * ephemeral focus is active, but it won't actually change node state until
     * the returned lambda is called. Additionally, only 1 ephemeral focus context
     * can be active at any given time (attempting to activate more than one
     * simultaneously will result in an error being thrown).
     */
    takeEphemeralFocus(focusableElement) {
      this.ensureManagerIsUnlocked();
      if (this.currentlyHoldsEphemeralFocus) {
        throw Error(
          `Attempted to take ephemeral focus when it's already held, with new element: ${focusableElement}.`
        );
      }
      this.currentlyHoldsEphemeralFocus = true;
      if (this.focusedNode) {
        this.passivelyFocusNode(this.focusedNode, null);
      }
      focusableElement.focus();
      let hasFinishedEphemeralFocus = false;
      return () => {
        if (hasFinishedEphemeralFocus) {
          throw Error(
            `Attempted to finish ephemeral focus twice for element: ${focusableElement}.`
          );
        }
        hasFinishedEphemeralFocus = true;
        this.currentlyHoldsEphemeralFocus = false;
        if (this.focusedNode) {
          this.activelyFocusNode(this.focusedNode, null);
          const capturedNode = this.focusedNode;
          setTimeout(() => {
            if (!this.focusedNode && this.previouslyFocusedNode === capturedNode && this.recentlyLostAllFocus) {
              this.focusNode(capturedNode);
            }
          }, 0);
        }
      };
    }
    /**
     * @returns whether something is currently holding ephemeral focus
     */
    ephemeralFocusTaken() {
      return this.currentlyHoldsEphemeralFocus;
    }
    /**
     * Ensures that the manager is currently allowing operations that change its
     * internal focus state (such as via focusNode()).
     *
     * If the manager is currently not allowing state changes, an exception is
     * thrown.
     */
    ensureManagerIsUnlocked() {
      if (this.lockFocusStateChanges) {
        throw Error(
          "FocusManager state changes cannot happen in a tree/node focus/blur callback."
        );
      }
    }
    /**
     * Updates the internally tracked focused node to the specified node, or null
     * if focus is being lost. This also updates previous focus tracking.
     *
     * @param newFocusedNode The new node to set as focused.
     */
    updateFocusedNode(newFocusedNode) {
      this.previouslyFocusedNode = this.focusedNode;
      this.focusedNode = newFocusedNode;
    }
    /**
     * Defocuses the current actively focused node tracked by the manager, iff
     * there's a node being tracked and the manager doesn't have ephemeral focus.
     */
    defocusCurrentFocusedNode() {
      if (this.focusedNode && !this.currentlyHoldsEphemeralFocus) {
        this.passivelyFocusNode(this.focusedNode, null);
        this.updateFocusedNode(null);
      }
    }
    /**
     * Marks the specified node as actively focused, also calling related
     * lifecycle callback methods for both the node and its parent tree. This
     * ensures that the node is properly styled to indicate its active focus.
     *
     * This does not change the manager's currently tracked node, nor does it
     * change any other nodes.
     *
     * @param node The node to be actively focused.
     * @param prevTree The tree of the previously actively focused node, or null
     *     if there wasn't a previously actively focused node.
     */
    activelyFocusNode(node, prevTree) {
      this.lockFocusStateChanges = true;
      const tree = node.getFocusableTree();
      const elem = node.getFocusableElement();
      const nextTreeReg = this.lookUpRegistration(tree);
      const treeIsTabManaged = nextTreeReg?.rootShouldBeAutoTabbable;
      if (tree !== prevTree) {
        tree.onTreeFocus(node, prevTree);
        if (treeIsTabManaged) {
          tree.getRootFocusableNode().getFocusableElement().tabIndex = -1;
        }
      }
      node.onNodeFocus();
      this.lockFocusStateChanges = false;
      if (!treeIsTabManaged || node !== tree.getRootFocusableNode()) {
        if (!elem.hasAttribute("tabindex")) elem.tabIndex = -1;
      }
      this.setNodeToVisualActiveFocus(node);
      elem.focus();
    }
    /**
     * Marks the specified node as passively focused, also calling related
     * lifecycle callback methods for both the node and its parent tree. This
     * ensures that the node is properly styled to indicate its passive focus.
     *
     * This does not change the manager's currently tracked node, nor does it
     * change any other nodes.
     *
     * @param node The node to be passively focused.
     * @param nextTree The tree of the node receiving active focus, or null if no
     *     node will be actively focused.
     */
    passivelyFocusNode(node, nextTree) {
      this.lockFocusStateChanges = true;
      const tree = node.getFocusableTree();
      if (tree !== nextTree) {
        tree.onTreeBlur(nextTree);
        const reg = this.lookUpRegistration(tree);
        if (reg?.rootShouldBeAutoTabbable) {
          tree.getRootFocusableNode().getFocusableElement().tabIndex = 0;
        }
      }
      node.onNodeBlur();
      this.lockFocusStateChanges = false;
      if (tree !== nextTree) {
        this.setNodeToVisualPassiveFocus(node);
      }
    }
    /**
     * Updates the node's styling to indicate that it should have an active focus
     * indicator.
     *
     * @param node The node to be styled for active focus.
     */
    setNodeToVisualActiveFocus(node) {
      const element = node.getFocusableElement();
      addClass(element, _FocusManager.ACTIVE_FOCUS_NODE_CSS_CLASS_NAME);
      removeClass(element, _FocusManager.PASSIVE_FOCUS_NODE_CSS_CLASS_NAME);
    }
    /**
     * Updates the node's styling to indicate that it should have a passive focus
     * indicator.
     *
     * @param node The node to be styled for passive focus.
     */
    setNodeToVisualPassiveFocus(node) {
      const element = node.getFocusableElement();
      removeClass(element, _FocusManager.ACTIVE_FOCUS_NODE_CSS_CLASS_NAME);
      addClass(element, _FocusManager.PASSIVE_FOCUS_NODE_CSS_CLASS_NAME);
    }
    /**
     * Removes any active/passive indicators for the specified node.
     *
     * @param node The node which should have neither passive nor active focus
     *     indication.
     */
    removeHighlight(node) {
      const element = node.getFocusableElement();
      removeClass(element, _FocusManager.ACTIVE_FOCUS_NODE_CSS_CLASS_NAME);
      removeClass(element, _FocusManager.PASSIVE_FOCUS_NODE_CSS_CLASS_NAME);
    }
    static {
      this.focusManager = null;
    }
    /**
     * Returns the page-global FocusManager.
     *
     * The returned instance is guaranteed to not change across function calls,
     * but may change across page loads.
     */
    static getFocusManager() {
      if (!_FocusManager.focusManager) {
        _FocusManager.focusManager = new _FocusManager(document.addEventListener);
      }
      return _FocusManager.focusManager;
    }
  };
  function getFocusManager() {
    return FocusManager.getFocusManager();
  }

  // core/utils/object.ts
  function deepMerge(target, source) {
    for (const x in source) {
      if (source[x] !== null && Array.isArray(source[x])) {
        target[x] = deepMerge(target[x] || [], source[x]);
      } else if (source[x] !== null && typeof source[x] === "object") {
        target[x] = deepMerge(target[x] || /* @__PURE__ */ Object.create(null), source[x]);
      } else {
        target[x] = source[x];
      }
    }
    return target;
  }

  // core/shortcut_registry.ts
  var ShortcutRegistry = class _ShortcutRegistry {
    /** Resets the existing ShortcutRegistry singleton. */
    constructor() {
      /** Registry of all keyboard shortcuts, keyed by name of shortcut. */
      this.shortcuts = /* @__PURE__ */ new Map();
      /** Map of key codes to an array of shortcut names. */
      this.keyMap = /* @__PURE__ */ new Map();
      this.reset();
    }
    static {
      this.registry = new _ShortcutRegistry();
    }
    /** Clear and recreate the registry and keyMap. */
    reset() {
      this.shortcuts.clear();
      this.keyMap.clear();
    }
    /**
     * Registers a keyboard shortcut.
     *
     * @param shortcut The shortcut for this key code.
     * @param allowOverrides True to prevent a warning when overriding an
     *     already registered item.
     * @throws {Error} if a shortcut with the same name already exists.
     */
    register(shortcut, allowOverrides) {
      const registeredShortcut = this.shortcuts.get(shortcut.name);
      if (registeredShortcut && !allowOverrides) {
        throw new Error(`Shortcut named "${shortcut.name}" already exists.`);
      }
      this.shortcuts.set(shortcut.name, shortcut);
      const keyCodes = shortcut.keyCodes;
      if (keyCodes?.length) {
        for (const keyCode of keyCodes) {
          this.addKeyMapping(keyCode, shortcut.name, !!shortcut.allowCollision);
        }
      }
    }
    /**
     * Unregisters a keyboard shortcut registered with the given name. This
     * will also remove any key mappings that reference this shortcut.
     *
     * @param shortcutName The name of the shortcut to unregister.
     * @returns True if an item was unregistered, false otherwise.
     */
    unregister(shortcutName) {
      const shortcut = this.shortcuts.get(shortcutName);
      if (!shortcut) {
        console.warn(`Keyboard shortcut named "${shortcutName}" not found.`);
        return false;
      }
      this.removeAllKeyMappings(shortcutName);
      this.shortcuts.delete(shortcutName);
      return true;
    }
    /**
     * Adds a mapping between a keycode and a keyboard shortcut.
     *
     * Normally only one shortcut can be mapped to any given keycode,
     * but setting allowCollisions to true allows a keyboard to be
     * mapped to multiple shortcuts.  In that case, when onKeyDown is
     * called with the given keystroke, it will process the mapped
     * shortcuts in reverse order, from the most- to least-recently
     * mapped).
     *
     * @param keyCode The key code for the keyboard shortcut. If registering a key
     *     code with a modifier (ex: ctrl+c) use
     *     ShortcutRegistry.registry.createSerializedKey;
     * @param shortcutName The name of the shortcut to execute when the given
     *     keycode is pressed.
     * @param allowCollision True to prevent an error when adding a shortcut
     *     to a key that is already mapped to a shortcut.
     * @throws {Error} if the given key code is already mapped to a shortcut.
     */
    addKeyMapping(keyCode, shortcutName, allowCollision) {
      keyCode = `${keyCode}`;
      const shortcutNames = this.keyMap.get(keyCode);
      if (shortcutNames && !allowCollision) {
        throw new Error(
          `Shortcut named "${shortcutName}" collides with shortcuts "${shortcutNames}"`
        );
      } else if (shortcutNames && allowCollision) {
        shortcutNames.unshift(shortcutName);
      } else {
        this.keyMap.set(keyCode, [shortcutName]);
      }
    }
    /**
     * Removes a mapping between a keycode and a keyboard shortcut.
     *
     * @param keyCode The key code for the keyboard shortcut. If registering a key
     *     code with a modifier (ex: ctrl+c) use
     *     ShortcutRegistry.registry.createSerializedKey;
     * @param shortcutName The name of the shortcut to execute when the given
     *     keycode is pressed.
     * @param quiet True to not console warn when there is no shortcut to
     *     remove.
     * @returns True if a key mapping was removed, false otherwise.
     */
    removeKeyMapping(keyCode, shortcutName, quiet) {
      const shortcutNames = this.keyMap.get(keyCode);
      if (!shortcutNames) {
        if (!quiet) {
          console.warn(
            `No keyboard shortcut named "${shortcutName}" registered with key code "${keyCode}"`
          );
        }
        return false;
      }
      const shortcutIdx = shortcutNames.indexOf(shortcutName);
      if (shortcutIdx > -1) {
        shortcutNames.splice(shortcutIdx, 1);
        if (shortcutNames.length === 0) {
          this.keyMap.delete(keyCode);
        }
        return true;
      }
      if (!quiet) {
        console.warn(
          `No keyboard shortcut named "${shortcutName}" registered with key code "${keyCode}"`
        );
      }
      return false;
    }
    /**
     * Removes all the key mappings for a shortcut with the given name.
     * Useful when changing the default key mappings and the key codes registered
     * to the shortcut are unknown.
     *
     * @param shortcutName The name of the shortcut to remove from the key map.
     */
    removeAllKeyMappings(shortcutName) {
      for (const keyCode of this.keyMap.keys()) {
        this.removeKeyMapping(
          keyCode,
          shortcutName,
          /* quiet= */
          true
        );
      }
    }
    /**
     * Sets the key map. Setting the key map will override any default key
     * mappings.
     *
     * @param newKeyMap The object with key code to shortcut names.
     */
    setKeyMap(newKeyMap) {
      this.keyMap.clear();
      for (const key in newKeyMap) {
        this.keyMap.set(key, newKeyMap[key]);
      }
    }
    /**
     * Gets the current key map.
     *
     * @returns The object holding key codes to ShortcutRegistry.KeyboardShortcut.
     */
    getKeyMap() {
      const legacyKeyMap = /* @__PURE__ */ Object.create(null);
      for (const [key, value] of this.keyMap) {
        legacyKeyMap[key] = value;
      }
      return legacyKeyMap;
    }
    /**
     * Gets the registry of keyboard shortcuts.
     *
     * @returns The registry of keyboard shortcuts.
     */
    getRegistry() {
      const legacyRegistry = /* @__PURE__ */ Object.create(null);
      for (const [key, value] of this.shortcuts) {
        legacyRegistry[key] = value;
      }
      return deepMerge(/* @__PURE__ */ Object.create(null), legacyRegistry);
    }
    /**
     * Handles key down events.
     *
     * - Any `KeyboardShortcut`(s) mapped to the keycodes that cause
     *   event `e` to be fired will be processed, in order from least-
     *   to most-recently registered.
     * - If the shortcut's `preconditionFn` exists it will be called.
     *   If `preconditionFn` returns false the shortcut's `callback`
     *   function will be skipped.  Processing will continue with the
     *   next shortcut, if any.
     * - The shortcut's `callback` function will then be called.  If it
     *   returns true, processing will terminate and `onKeyDown` will
     *   return true.  If it returns false, processing will continue
     *   with with the next shortcut, if any.
     * - If all registered shortcuts for the given keycode have been
     *   processed without any having returned true, `onKeyDown` will
     *   return false.
     *
     * @param workspace The main workspace where the event was captured.
     * @param e The key down event.
     * @returns True if the event was handled, false otherwise.
     */
    onKeyDown(workspace, e) {
      const key = this.serializeKeyEvent(e);
      const shortcutNames = this.getShortcutNamesByKeyCode(key);
      if (!shortcutNames) return false;
      for (const shortcutName of shortcutNames) {
        const shortcut = this.shortcuts.get(shortcutName);
        if (!shortcut || shortcut.preconditionFn && !shortcut.preconditionFn(workspace, {
          focusedNode: getFocusManager().getFocusedNode() ?? void 0
        })) {
          continue;
        }
        if (shortcut.callback?.(workspace, e, shortcut, {
          focusedNode: getFocusManager().getFocusedNode() ?? void 0
        })) {
          return true;
        }
      }
      return false;
    }
    /**
     * Gets the shortcuts registered to the given key code.
     *
     * @param keyCode The serialized key code.
     * @returns The list of shortcuts to call when the given keyCode is used.
     *     Undefined if no shortcuts exist.
     */
    getShortcutNamesByKeyCode(keyCode) {
      return this.keyMap.get(keyCode)?.slice() || [];
    }
    /**
     * Gets the serialized key codes that the shortcut with the given name is
     * registered under.
     *
     * @param shortcutName The name of the shortcut.
     * @returns An array with all the key codes the shortcut is registered under.
     */
    getKeyCodesByShortcutName(shortcutName) {
      const keys = [];
      for (const [keyCode, shortcuts] of this.keyMap) {
        const shortcutIdx = shortcuts.indexOf(shortcutName);
        if (shortcutIdx > -1) {
          keys.push(keyCode);
        }
      }
      return keys;
    }
    /**
     * Serializes a key event.
     *
     * @param e A key down event.
     * @returns The serialized key code for the given event.
     */
    serializeKeyEvent(e) {
      let serializedKey = "";
      for (const modifier in _ShortcutRegistry.modifierKeys) {
        if (e.getModifierState(modifier)) {
          if (serializedKey !== "") {
            serializedKey += "+";
          }
          serializedKey += modifier;
        }
      }
      if (serializedKey !== "" && e.keyCode) {
        serializedKey += "+" + e.keyCode;
      } else if (e.keyCode) {
        serializedKey = String(e.keyCode);
      }
      return serializedKey;
    }
    /**
     * Checks whether any of the given modifiers are not valid.
     *
     * @param modifiers List of modifiers to be used with the key.
     * @throws {Error} if the modifier is not in the valid modifiers list.
     */
    checkModifiers(modifiers) {
      for (const modifier of modifiers) {
        if (!(modifier in _ShortcutRegistry.modifierKeys)) {
          throw new Error(modifier + " is not a valid modifier key.");
        }
      }
    }
    /**
     * Creates the serialized key code that will be used in the key map.
     *
     * @param keyCode Number code representing the key.
     * @param modifiers List of modifier key codes to be used with the key. All
     *     valid modifiers can be found in the `ShortcutRegistry.modifierKeys`.
     * @returns The serialized key code for the given modifiers and key.
     */
    createSerializedKey(keyCode, modifiers) {
      let serializedKey = "";
      if (modifiers) {
        this.checkModifiers(modifiers);
        for (const modifier in _ShortcutRegistry.modifierKeys) {
          const modifierKeyCode = _ShortcutRegistry.modifierKeys[modifier];
          if (modifiers.includes(modifierKeyCode)) {
            if (serializedKey !== "") {
              serializedKey += "+";
            }
            serializedKey += modifier;
          }
        }
      }
      if (serializedKey !== "" && keyCode) {
        serializedKey += "+" + keyCode;
      } else if (keyCode) {
        serializedKey = `${keyCode}`;
      }
      return serializedKey;
    }
  };
  ((ShortcutRegistry2) => {
    let modifierKeys;
    ((modifierKeys2) => {
      modifierKeys2[modifierKeys2["Shift"] = 16 /* SHIFT */] = "Shift";
      modifierKeys2[modifierKeys2["Control"] = 17 /* CTRL */] = "Control";
      modifierKeys2[modifierKeys2["Alt"] = 18 /* ALT */] = "Alt";
      modifierKeys2[modifierKeys2["Meta"] = 91 /* META */] = "Meta";
    })(modifierKeys = ShortcutRegistry2.modifierKeys || (ShortcutRegistry2.modifierKeys = {}));
  })(ShortcutRegistry || (ShortcutRegistry = {}));

  // core/common.ts
  var mainWorkspace;
  function getMainWorkspace() {
    return mainWorkspace;
  }

  // core/msg.ts
  var Msg = /* @__PURE__ */ Object.create(null);

  // core/css.ts
  var injected = false;
  function register(cssContent) {
    if (injected) {
      throw Error("CSS already injected");
    }
    content += "\n" + cssContent;
  }
  var content = `
.blocklySvg {
  background-color: #fff;
  outline: none;
  overflow: hidden;  /* IE overflows by default. */
  position: absolute;
  display: block;
}

.blocklyWidgetDiv {
  display: none;
  position: absolute;
  z-index: 99999;  /* big value for bootstrap3 compatibility */
}

.injectionDiv {
  height: 100%;
  position: relative;
  overflow: hidden;  /* So blocks in drag surface disappear at edges */
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.blocklyBlockCanvas.blocklyCanvasTransitioning,
.blocklyBubbleCanvas.blocklyCanvasTransitioning {
  transition: transform .5s;
}

.blocklyEmboss {
  filter: var(--blocklyEmbossFilter);
}

.blocklyTooltipDiv {
  background-color: #ffffc7;
  border: 1px solid #ddc;
  box-shadow: 4px 4px 20px 1px rgba(0,0,0,.15);
  color: #000;
  display: none;
  font: 9pt sans-serif;
  opacity: .9;
  padding: 2px;
  position: absolute;
  z-index: 100000;  /* big value for bootstrap3 compatibility */
}

.blocklyDropDownDiv {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
  display: none;
  border: 1px solid;
  border-color: #dadce0;
  background-color: #fff;
  border-radius: 2px;
  padding: 4px;
  box-shadow: 0 0 3px 1px rgba(0,0,0,.3);
}

.blocklyDropDownDiv:focus {
  box-shadow: 0 0 6px 1px rgba(0,0,0,.3);
}

.blocklyDropDownContent {
  max-height: 300px;  /* @todo: spec for maximum height. */
}

.blocklyDropDownArrow {
  position: absolute;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  z-index: -1;
  background-color: inherit;
  border-color: inherit;
  border-top: 1px solid;
  border-left: 1px solid;
  border-top-left-radius: 4px;
  border-color: inherit;
}

.blocklyHighlighted>.blocklyPath {
  filter: var(--blocklyEmbossFilter);
}

.blocklyHighlightedConnectionPath {
  fill: none;
  stroke: #fc3;
  stroke-width: 4px;
}

.blocklyPathLight {
  fill: none;
  stroke-linecap: round;
  stroke-width: 1;
}

.blocklySelected>.blocklyPathLight {
  display: none;
}

.blocklyDraggable {
  cursor: grab;
  cursor: -webkit-grab;
}

.blocklyDragging {
  cursor: grabbing;
  cursor: -webkit-grabbing;
  /* Drag surface disables events to not block the toolbox, so we have to
   * reenable them here for the cursor values to work. */
  pointer-events: auto;
}

  /* Changes cursor on mouse down. Not effective in Firefox because of
     https://bugzilla.mozilla.org/show_bug.cgi?id=771241 */
.blocklyDraggable:active {
  cursor: grabbing;
  cursor: -webkit-grabbing;
}

.blocklyDragging.blocklyDraggingDelete {
  cursor: url("<<<PATH>>>/handdelete.cur"), auto;
}

.blocklyDragging>.blocklyPath,
.blocklyDragging>.blocklyPathLight {
  fill-opacity: .8;
  stroke-opacity: .8;
}

.blocklyDragging>.blocklyPathDark {
  display: none;
}

.blocklyDisabledPattern>.blocklyPath {
  fill: var(--blocklyDisabledPattern);
  fill-opacity: .5;
  stroke-opacity: .5;
}

.blocklyDisabled>.blocklyPathLight,
.blocklyDisabled>.blocklyPathDark {
  display: none;
}

.blocklyInsertionMarker>.blocklyPath,
.blocklyInsertionMarker>.blocklyPathLight,
.blocklyInsertionMarker>.blocklyPathDark {
  fill-opacity: .2;
  stroke: none;
}

.blocklyNonEditableField>text {
  pointer-events: none;
}

.blocklyFlyout {
  position: absolute;
  z-index: 20;
}

.blocklyText text {
  cursor: default;
}

/*
  Don't allow users to select text.  It gets annoying when trying to
  drag a block and selected text moves instead.
*/
.blocklySvg text {
  user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  cursor: inherit;
}

.blocklyIconGroup {
  cursor: default;
}

.blocklyIconGroup:not(:hover),
.blocklyIconGroupReadonly {
  opacity: .6;
}

.blocklyIconShape {
  fill: #00f;
  stroke: #fff;
  stroke-width: 1px;
}

.blocklyIconSymbol {
  fill: #fff;
}

.blocklyMinimalBody {
  margin: 0;
  padding: 0;
  height: 100%;
}

.blocklyHtmlInput {
  border: none;
  border-radius: 4px;
  height: 100%;
  margin: 0;
  outline: none;
  padding: 0;
  width: 100%;
  text-align: center;
  display: block;
  box-sizing: border-box;
}

/* Remove the increase and decrease arrows on the field number editor */
input.blocklyHtmlInput[type=number]::-webkit-inner-spin-button,
input.blocklyHtmlInput[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.blocklyMainBackground {
  stroke-width: 1;
  stroke: #c6c6c6;  /* Equates to #ddd due to border being off-pixel. */
}

.blocklyMutatorBackground {
  fill: #fff;
  stroke: #ddd;
  stroke-width: 1;
}

.blocklyFlyoutBackground {
  fill: #ddd;
  fill-opacity: .8;
}

.blocklyMainWorkspaceScrollbar {
  z-index: 20;
}

.blocklyFlyoutScrollbar {
  z-index: 30;
}

.blocklyScrollbarHorizontal,
.blocklyScrollbarVertical {
  position: absolute;
  outline: none;
}

.blocklyScrollbarBackground {
  opacity: 0;
  pointer-events: none;
}

.blocklyScrollbarHandle {
  fill: #ccc;
}

.blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,
.blocklyScrollbarHandle:hover {
  fill: #bbb;
}

/* Darken flyout scrollbars due to being on a grey background. */
/* By contrast, workspace scrollbars are on a white background. */
.blocklyFlyout .blocklyScrollbarHandle {
  fill: #bbb;
}

.blocklyFlyout .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,
.blocklyFlyout .blocklyScrollbarHandle:hover {
  fill: #aaa;
}

.blocklyInvalidInput {
  background: #faa;
}

.blocklyVerticalMarker {
  stroke-width: 3px;
  fill: rgba(255,255,255,.5);
  pointer-events: none;
}

.blocklyComputeCanvas {
  position: absolute;
  width: 0;
  height: 0;
}

.blocklyNoPointerEvents {
  pointer-events: none;
}

.blocklyContextMenu {
  border-radius: 4px;
  max-height: 100%;
}

.blocklyDropdownMenu {
  border-radius: 2px;
  padding: 0 !important;
}

.blocklyDropdownMenu .blocklyMenuItem {
  /* 28px on the left for icon or checkbox. */
  padding-left: 28px;
}

/* BiDi override for the resting state. */
.blocklyDropdownMenu .blocklyMenuItemRtl {
  /* Flip left/right padding for BiDi. */
  padding-left: 5px;
  padding-right: 28px;
}

.blocklyWidgetDiv .blocklyMenu {
  user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  background: #fff;
  border: 1px solid transparent;
  box-shadow: 0 0 3px 1px rgba(0,0,0,.3);
  font: normal 13px Arial, sans-serif;
  margin: 0;
  outline: none;
  padding: 4px 0;
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  z-index: 20000;  /* Arbitrary, but some apps depend on it... */
}

.blocklyWidgetDiv .blocklyMenu:focus {
  box-shadow: 0 0 6px 1px rgba(0,0,0,.3);
}

.blocklyDropDownDiv .blocklyMenu {
  user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  background: inherit;  /* Compatibility with gapi, reset from goog-menu */
  border: inherit;  /* Compatibility with gapi, reset from goog-menu */
  font: normal 13px "Helvetica Neue", Helvetica, sans-serif;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  z-index: 20000;  /* Arbitrary, but some apps depend on it... */
}

/* State: resting. */
.blocklyMenuItem {
  border: none;
  color: #000;
  cursor: pointer;
  list-style: none;
  margin: 0;
  /* 7em on the right for shortcut. */
  min-width: 7em;
  padding: 6px 15px;
  white-space: nowrap;
}

/* State: disabled. */
.blocklyMenuItemDisabled {
  color: #ccc;
  cursor: inherit;
}

/* State: hover. */
.blocklyMenuItemHighlight {
  background-color: rgba(0,0,0,.1);
}

/* State: selected/checked. */
.blocklyMenuItemCheckbox {
  height: 16px;
  position: absolute;
  width: 16px;
}

.blocklyMenuItemSelected .blocklyMenuItemCheckbox {
  background: url(<<<PATH>>>/sprites.png) no-repeat -48px -16px;
  float: left;
  margin-left: -24px;
  position: static;  /* Scroll with the menu. */
}

.blocklyMenuItemRtl .blocklyMenuItemCheckbox {
  float: right;
  margin-right: -24px;
}

.blocklyMenuSeparator {
  background-color: #ccc;
  height: 1px;
  border: 0;
  margin-left: 4px;
  margin-right: 4px;
}

.blocklyBlockDragSurface, .blocklyAnimationLayer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: visible !important;
  z-index: 80;
  pointer-events: none;
}

.blocklyField {
  cursor: default;
}

.blocklyInputField {
  cursor: text;
}

.blocklyDragging .blocklyField,
.blocklyDragging .blocklyIconGroup {
  cursor: grabbing;
}

.blocklyActiveFocus:is(
  .blocklyFlyout,
  .blocklyWorkspace,
  .blocklyField,
  .blocklyPath,
  .blocklyHighlightedConnectionPath,
  .blocklyComment,
  .blocklyBubble,
  .blocklyIconGroup,
  .blocklyTextarea
) {
  outline: none;
}
`;

  // core/utils/aria.ts
  var ARIA_PREFIX = "aria-";
  var ROLE_ATTRIBUTE = "role";
  function setRole(element, roleName) {
    element.setAttribute(ROLE_ATTRIBUTE, roleName);
  }
  function setState(element, stateName, value) {
    if (Array.isArray(value)) {
      value = value.join(" ");
    }
    const attrStateName = ARIA_PREFIX + stateName;
    element.setAttribute(attrStateName, `${value}`);
  }

  // core/utils/svg.ts
  var Svg = class _Svg {
    /**
     * @param tagName The SVG element tag name.
     * @internal
     */
    constructor(tagName) {
      this.tagName = tagName;
    }
    static {
      /** @internal */
      this.ANIMATE = new _Svg("animate");
    }
    static {
      /** @internal */
      this.CIRCLE = new _Svg("circle");
    }
    static {
      /** @internal */
      this.CLIPPATH = new _Svg("clipPath");
    }
    static {
      /** @internal */
      this.DEFS = new _Svg("defs");
    }
    static {
      /** @internal */
      this.FECOMPOSITE = new _Svg("feComposite");
    }
    static {
      /** @internal */
      this.FECOMPONENTTRANSFER = new _Svg(
        "feComponentTransfer"
      );
    }
    static {
      /** @internal */
      this.FEFLOOD = new _Svg("feFlood");
    }
    static {
      /** @internal */
      this.FEFUNCA = new _Svg("feFuncA");
    }
    static {
      /** @internal */
      this.FEGAUSSIANBLUR = new _Svg("feGaussianBlur");
    }
    static {
      /** @internal */
      this.FEPOINTLIGHT = new _Svg("fePointLight");
    }
    static {
      /** @internal */
      this.FESPECULARLIGHTING = new _Svg(
        "feSpecularLighting"
      );
    }
    static {
      /** @internal */
      this.FILTER = new _Svg("filter");
    }
    static {
      /** @internal */
      this.FOREIGNOBJECT = new _Svg("foreignObject");
    }
    static {
      /** @internal */
      this.G = new _Svg("g");
    }
    static {
      /** @internal */
      this.IMAGE = new _Svg("image");
    }
    static {
      /** @internal */
      this.LINE = new _Svg("line");
    }
    static {
      /** @internal */
      this.PATH = new _Svg("path");
    }
    static {
      /** @internal */
      this.PATTERN = new _Svg("pattern");
    }
    static {
      /** @internal */
      this.POLYGON = new _Svg("polygon");
    }
    static {
      /** @internal */
      this.RECT = new _Svg("rect");
    }
    static {
      /** @internal */
      this.SVG = new _Svg("svg");
    }
    static {
      /** @internal */
      this.TEXT = new _Svg("text");
    }
    static {
      /** @internal */
      this.TSPAN = new _Svg("tspan");
    }
    /**
     * Returns the SVG element tag name.
     *
     * @returns The name.
     */
    toString() {
      return this.tagName;
    }
  };

  // core/toast.ts
  var CLASS_NAME = "blocklyToast";
  var MESSAGE_CLASS_NAME = "blocklyToastMessage";
  var CLOSE_BUTTON_CLASS_NAME = "blocklyToastCloseButton";
  var Toast = class _Toast {
    static {
      /** IDs of toasts that have previously been shown. */
      this.shownIds = /* @__PURE__ */ new Set();
    }
    /**
     * Shows a toast notification.
     *
     * @param workspace The workspace to show the toast on.
     * @param options Configuration options for the toast message, duration, etc.
     */
    static show(workspace, options) {
      if (options.oncePerSession && options.id) {
        if (this.shownIds.has(options.id)) return;
        this.shownIds.add(options.id);
      }
      this.hide(workspace);
      const toast = this.createDom(workspace, options);
      requestAnimationFrame(() => {
        toast.style.bottom = "2rem";
      });
    }
    /**
     * Creates the DOM representation of a toast.
     *
     * @param workspace The workspace to inject the toast notification onto.
     * @param options Configuration options for the toast.
     * @returns The root DOM element of the toast.
     */
    static createDom(workspace, options) {
      const {
        message,
        duration = 5,
        assertiveness = _Toast.Assertiveness.POLITE
      } = options;
      const toast = document.createElement("div");
      workspace.getInjectionDiv().appendChild(toast);
      toast.dataset.toastId = options.id;
      toast.className = CLASS_NAME;
      setRole(toast, "status" /* STATUS */);
      setState(toast, "live" /* LIVE */, assertiveness);
      const messageElement = toast.appendChild(document.createElement("div"));
      messageElement.className = MESSAGE_CLASS_NAME;
      messageElement.innerText = message;
      const closeButton = toast.appendChild(document.createElement("button"));
      closeButton.className = CLOSE_BUTTON_CLASS_NAME;
      setState(closeButton, "label" /* LABEL */, Msg["CLOSE"]);
      const closeIcon = createSvgElement(
        Svg.SVG,
        {
          width: 24,
          height: 24,
          viewBox: "0 0 24 24",
          fill: "none"
        },
        closeButton
      );
      setState(closeIcon, "hidden" /* HIDDEN */, true);
      createSvgElement(
        Svg.RECT,
        {
          x: 19.7782,
          y: 2.80762,
          width: 2,
          height: 24,
          transform: "rotate(45, 19.7782, 2.80762)",
          fill: "black"
        },
        closeIcon
      );
      createSvgElement(
        Svg.RECT,
        {
          x: 2.80762,
          y: 4.22183,
          width: 2,
          height: 24,
          transform: "rotate(-45, 2.80762, 4.22183)",
          fill: "black"
        },
        closeIcon
      );
      closeButton.addEventListener("click", () => {
        toast.remove();
        workspace.markFocused();
      });
      let timeout;
      const setToastTimeout = () => {
        timeout = setTimeout(() => toast.remove(), duration * 1e3);
      };
      const clearToastTimeout = () => clearTimeout(timeout);
      toast.addEventListener("focusin", clearToastTimeout);
      toast.addEventListener("focusout", setToastTimeout);
      toast.addEventListener("mouseenter", clearToastTimeout);
      toast.addEventListener("mousemove", clearToastTimeout);
      toast.addEventListener("mouseleave", setToastTimeout);
      setToastTimeout();
      return toast;
    }
    /**
     * Dismiss a toast, e.g. in response to a user action.
     *
     * @param workspace The workspace to dismiss a toast in.
     * @param id The toast ID, or undefined to clear any toast.
     */
    static hide(workspace, id) {
      const toast = workspace.getInjectionDiv().querySelector(`.${CLASS_NAME}`);
      if (toast instanceof HTMLElement && (!id || id === toast.dataset.toastId)) {
        toast.remove();
      }
    }
  };
  ((Toast2) => {
    let Assertiveness;
    ((Assertiveness2) => {
      Assertiveness2["ASSERTIVE"] = "assertive";
      Assertiveness2["POLITE"] = "polite";
    })(Assertiveness = Toast2.Assertiveness || (Toast2.Assertiveness = {}));
  })(Toast || (Toast = {}));
  register(`
.${CLASS_NAME} {
  font-size: 1.2rem;
  position: absolute;
  bottom: -10rem;
  right: 2rem;
  padding: 1rem;
  color: black;
  background-color: white;
  border: 2px solid black;
  border-radius: 0.4rem;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  line-height: 1.5;
  transition: bottom 0.3s ease-out;
}

.${CLASS_NAME} .${MESSAGE_CLASS_NAME} {
  maxWidth: 18rem;
}

.${CLASS_NAME} .${CLOSE_BUTTON_CLASS_NAME} {
  margin: 0;
  padding: 0.2rem;
  background-color: transparent;
  color: black;
  border: none;
  cursor: pointer;
}
`);

  // core/dialog.ts
  var defaultToast = Toast.show.bind(Toast);

  // core/utils/xml.ts
  var domParser = {
    parseFromString: function() {
      throw new Error(
        "DOMParser was not found in the global scope and was not properly injected using injectDependencies"
      );
    }
  };
  var xmlSerializer = {
    serializeToString: function() {
      throw new Error(
        "XMLSerializer was not foundin the global scope and was not properly injected using injectDependencies"
      );
    }
  };
  var { document: document2, DOMParser, XMLSerializer } = globalThis;
  if (DOMParser) domParser = new DOMParser();
  if (XMLSerializer) xmlSerializer = new XMLSerializer();

  // core/variables.ts
  function allUsedVarModels(ws) {
    const blocks = ws.getAllBlocks(false);
    const variables = /* @__PURE__ */ new Set();
    for (let i = 0; i < blocks.length; i++) {
      const blockVariables = blocks[i].getVarModels();
      if (blockVariables) {
        for (let j = 0; j < blockVariables.length; j++) {
          const variable = blockVariables[j];
          const id = variable.getId();
          if (id) {
            variables.add(variable);
          }
        }
      }
    }
    return Array.from(variables.values());
  }
  function allDeveloperVariables(workspace) {
    const blocks = workspace.getAllBlocks(false);
    const variables = /* @__PURE__ */ new Set();
    for (let i = 0, block; block = blocks[i]; i++) {
      const getDeveloperVariables = block.getDeveloperVariables;
      if (getDeveloperVariables) {
        const devVars = getDeveloperVariables();
        for (let j = 0; j < devVars.length; j++) {
          variables.add(devVars[j]);
        }
      }
    }
    return Array.from(variables.values());
  }

  // core/names.ts
  var Names = class {
    /**
     * @param reservedWordsList A comma-separated string of words that are illegal
     *     for use as names in a language (e.g. 'new,if,this,...').
     * @param opt_variablePrefix Some languages need a '$' or a namespace before
     *     all variable names (but not procedure names).
     */
    constructor(reservedWordsList, opt_variablePrefix) {
      /**
       * A map from type (e.g. name, procedure) to maps from names to generated
       * names.
       */
      this.db = /* @__PURE__ */ new Map();
      /** A set of used names to avoid collisions. */
      this.dbReverse = /* @__PURE__ */ new Set();
      /**
       * The variable map from the workspace, containing Blockly variable models.
       */
      this.variableMap = null;
      this.variablePrefix = opt_variablePrefix || "";
      this.reservedWords = new Set(
        reservedWordsList ? reservedWordsList.split(",") : []
      );
    }
    /**
     * Empty the database and start from scratch.  The reserved words are kept.
     */
    reset() {
      this.db.clear();
      this.dbReverse.clear();
      this.variableMap = null;
    }
    /**
     * Set the variable map that maps from variable name to variable object.
     *
     * @param map The map to track.
     */
    setVariableMap(map) {
      this.variableMap = map;
    }
    /**
     * Get the name for a user-defined variable, based on its ID.
     * This should only be used for variables of NameType VARIABLE.
     *
     * @param id The ID to look up in the variable map.
     * @returns The name of the referenced variable, or null if there was no
     *     variable map or the variable was not found in the map.
     */
    getNameForUserVariable(id) {
      if (!this.variableMap) {
        console.warn(
          "Deprecated call to Names.prototype.getName without defining a variable map. To fix, add the following code in your generator's init() function:\nBlockly.YourGeneratorName.nameDB_.setVariableMap(workspace.getVariableMap());"
        );
        return null;
      }
      const variable = this.variableMap.getVariableById(id);
      if (variable) {
        return variable.getName();
      }
      return null;
    }
    /**
     * Generate names for user variables, but only ones that are being used.
     *
     * @param workspace Workspace to generate variables from.
     */
    populateVariables(workspace) {
      const variables = allUsedVarModels(workspace);
      for (let i = 0; i < variables.length; i++) {
        this.getName(variables[i].getId(), NameType.VARIABLE);
      }
    }
    /**
     * Generate names for procedures.
     *
     * @param workspace Workspace to generate procedures from.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    populateProcedures(workspace) {
      throw new Error(
        "The implementation of populateProcedures should be monkey-patched in by blockly.ts"
      );
    }
    /**
     * Convert a Blockly entity name to a legal exportable entity name.
     *
     * @param nameOrId The Blockly entity name (no constraints) or variable ID.
     * @param type The type of the name in Blockly ('VARIABLE', 'PROCEDURE',
     *     'DEVELOPER_VARIABLE', etc...).
     * @returns An entity name that is legal in the exported language.
     */
    getName(nameOrId, type) {
      let name = nameOrId;
      if (type === NameType.VARIABLE) {
        const varName = this.getNameForUserVariable(nameOrId);
        if (varName) {
          name = varName;
        }
      }
      const normalizedName = name.toLowerCase();
      const isVar = type === NameType.VARIABLE || type === NameType.DEVELOPER_VARIABLE;
      const prefix = isVar ? this.variablePrefix : "";
      if (!this.db.has(type)) {
        this.db.set(type, /* @__PURE__ */ new Map());
      }
      const typeDb = this.db.get(type);
      if (typeDb.has(normalizedName)) {
        return prefix + typeDb.get(normalizedName);
      }
      const safeName = this.getDistinctName(name, type);
      typeDb.set(normalizedName, safeName.substr(prefix.length));
      return safeName;
    }
    /**
     * Return a list of all known user-created names of a specified name type.
     *
     * @param type The type of entity in Blockly ('VARIABLE', 'PROCEDURE',
     *     'DEVELOPER_VARIABLE', etc...).
     * @returns A list of Blockly entity names (no constraints).
     */
    getUserNames(type) {
      const userNames = this.db.get(type)?.keys();
      return userNames ? Array.from(userNames) : [];
    }
    /**
     * Convert a Blockly entity name to a legal exportable entity name.
     * Ensure that this is a new name not overlapping any previously defined name.
     * Also check against list of reserved words for the current language and
     * ensure name doesn't collide.
     *
     * @param name The Blockly entity name (no constraints).
     * @param type The type of entity in Blockly ('VARIABLE', 'PROCEDURE',
     *     'DEVELOPER_VARIABLE', etc...).
     * @returns An entity name that is legal in the exported language.
     */
    getDistinctName(name, type) {
      let safeName = this.safeName(name);
      let i = null;
      while (this.dbReverse.has(safeName + (i ?? "")) || this.reservedWords.has(safeName + (i ?? ""))) {
        i = i ? i + 1 : 2;
      }
      safeName += i ?? "";
      this.dbReverse.add(safeName);
      const isVar = type === NameType.VARIABLE || type === NameType.DEVELOPER_VARIABLE;
      const prefix = isVar ? this.variablePrefix : "";
      return prefix + safeName;
    }
    /**
     * Given a proposed entity name, generate a name that conforms to the
     * [_A-Za-z][_A-Za-z0-9]* format that most languages consider legal for
     * variable and function names.
     *
     * @param name Potentially illegal entity name.
     * @returns Safe entity name.
     */
    safeName(name) {
      if (!name) {
        name = Msg["UNNAMED_KEY"] || "unnamed";
      } else {
        name = encodeURI(name.replace(/ /g, "_")).replace(/[^\w]/g, "_");
        if ("0123456789".includes(name[0])) {
          name = "my_" + name;
        }
      }
      return name;
    }
    /**
     * Do the given two entity names refer to the same entity?
     * Blockly names are case-insensitive.
     *
     * @param name1 First name.
     * @param name2 Second name.
     * @returns True if names are the same.
     */
    static equals(name1, name2) {
      return name1.toLowerCase() === name2.toLowerCase();
    }
  };
  ((Names3) => {
    let NameType2;
    ((NameType3) => {
      NameType3["DEVELOPER_VARIABLE"] = "DEVELOPER_VARIABLE";
      NameType3["VARIABLE"] = "VARIABLE";
      NameType3["PROCEDURE"] = "PROCEDURE";
    })(NameType2 = Names3.NameType || (Names3.NameType = {}));
  })(Names || (Names = {}));
  var NameType = Names.NameType;
  Names.DEVELOPER_VARIABLE_TYPE = NameType.DEVELOPER_VARIABLE;

  // core/generator.ts
  var CodeGenerator = class {
    /** @param name Language name of this generator. */
    constructor(name) {
      /**
       * A dictionary of block generator functions, keyed by block type.
       * Each block generator function takes two parameters:
       *
       * - the Block to generate code for, and
       * - the calling CodeGenerator (or subclass) instance, so the
       *   function can call methods defined below (e.g. blockToCode) or
       *   on the relevant subclass (e.g. JavascripGenerator),
       *
       * and returns:
       *
       * - a [code, precedence] tuple (for value/expression blocks), or
       * - a string containing the generated code (for statement blocks), or
       * - null if no code should be emitted for block.
       */
      this.forBlock = /* @__PURE__ */ Object.create(null);
      /**
       * This is used as a placeholder in functions defined using
       * CodeGenerator.provideFunction_.  It must not be legal code that could
       * legitimately appear in a function definition (or comment), and it must
       * not confuse the regular expression parser.
       */
      this.FUNCTION_NAME_PLACEHOLDER_ = "{leCUI8hutHZI4480Dc}";
      /**
       * Arbitrary code to inject into locations that risk causing infinite loops.
       * Any instances of '%1' will be replaced by the block ID that failed.
       * E.g. `  checkTimeout(%1);\n`
       */
      this.INFINITE_LOOP_TRAP = null;
      /**
       * Arbitrary code to inject before every statement.
       * Any instances of '%1' will be replaced by the block ID of the statement.
       * E.g. `highlight(%1);\n`
       */
      this.STATEMENT_PREFIX = null;
      /**
       * Arbitrary code to inject after every statement.
       * Any instances of '%1' will be replaced by the block ID of the statement.
       * E.g. `highlight(%1);\n`
       */
      this.STATEMENT_SUFFIX = null;
      /**
       * The method of indenting.  Defaults to two spaces, but language generators
       * may override this to increase indent or change to tabs.
       */
      this.INDENT = "  ";
      /**
       * Maximum length for a comment before wrapping.  Does not account for
       * indenting level.
       */
      this.COMMENT_WRAP = 60;
      /** List of outer-inner pairings that do NOT require parentheses. */
      this.ORDER_OVERRIDES = [];
      /**
       * Whether the init method has been called.
       * Generators that set this flag to false after creation and true in init
       * will cause blockToCode to emit a warning if the generator has not been
       * initialized. If this flag is untouched, it will have no effect.
       */
      this.isInitialized = null;
      /** Comma-separated list of reserved words. */
      this.RESERVED_WORDS_ = "";
      /** A dictionary of definitions to be printed before the code. */
      this.definitions_ = /* @__PURE__ */ Object.create(null);
      /**
       * A dictionary mapping desired function names in definitions_ to actual
       * function names (to avoid collisions with user functions).
       */
      this.functionNames_ = /* @__PURE__ */ Object.create(null);
      /** A database of variable and procedure names. */
      this.nameDB_ = void 0;
      this.name_ = name;
      this.FUNCTION_NAME_PLACEHOLDER_REGEXP_ = new RegExp(
        this.FUNCTION_NAME_PLACEHOLDER_,
        "g"
      );
    }
    /**
     * Generate code for all blocks in the workspace to the specified language.
     *
     * @param workspace Workspace to generate code from.
     * @returns Generated code.
     */
    workspaceToCode(workspace) {
      if (!workspace) {
        console.warn(
          "No workspace specified in workspaceToCode call.  Guessing."
        );
        workspace = getMainWorkspace();
      }
      const code = [];
      this.init(workspace);
      const blocks = workspace.getTopBlocks(true);
      for (let i = 0, block; block = blocks[i]; i++) {
        let line = this.blockToCode(block);
        if (Array.isArray(line)) {
          line = line[0];
        }
        if (line) {
          if (block.outputConnection) {
            line = this.scrubNakedValue(line);
            if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
              line = this.injectId(this.STATEMENT_PREFIX, block) + line;
            }
            if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
              line = line + this.injectId(this.STATEMENT_SUFFIX, block);
            }
          }
          code.push(line);
        }
      }
      let codeString = code.join("\n");
      codeString = this.finish(codeString);
      codeString = codeString.replace(/^\s+\n/, "");
      codeString = codeString.replace(/\n\s+$/, "\n");
      codeString = codeString.replace(/[ \t]+\n/g, "\n");
      return codeString;
    }
    /**
     * Prepend a common prefix onto each line of code.
     * Intended for indenting code or adding comment markers.
     *
     * @param text The lines of code.
     * @param prefix The common prefix.
     * @returns The prefixed lines of code.
     */
    prefixLines(text, prefix) {
      return prefix + text.replace(/(?!\n$)\n/g, "\n" + prefix);
    }
    /**
     * Recursively spider a tree of blocks, returning all their comments.
     *
     * @param block The block from which to start spidering.
     * @returns Concatenated list of comments.
     */
    allNestedComments(block) {
      const comments = [];
      const blocks = block.getDescendants(true);
      for (let i = 0; i < blocks.length; i++) {
        const comment = blocks[i].getCommentText();
        if (comment) {
          comments.push(comment);
        }
      }
      if (comments.length) {
        comments.push("");
      }
      return comments.join("\n");
    }
    /**
     * Generate code for the specified block (and attached blocks).
     * The generator must be initialized before calling this function.
     *
     * @param block The block to generate code for.
     * @param opt_thisOnly True to generate code for only this statement.
     * @returns For statement blocks, the generated code.
     *     For value blocks, an array containing the generated code and an
     * operator order value.  Returns '' if block is null.
     */
    blockToCode(block, opt_thisOnly) {
      if (this.isInitialized === false) {
        console.warn(
          "CodeGenerator init was not called before blockToCode was called."
        );
      }
      if (!block) {
        return "";
      }
      if (!block.isEnabled()) {
        return opt_thisOnly ? "" : this.blockToCode(block.getNextBlock());
      }
      if (block.isInsertionMarker()) {
        return opt_thisOnly ? "" : this.blockToCode(block.getChildren(false)[0]);
      }
      const func = this.forBlock[block.type];
      if (typeof func !== "function") {
        throw Error(
          `${this.name_} generator does not know how to generate code for block type "${block.type}".`
        );
      }
      let code = func.call(block, block, this);
      if (Array.isArray(code)) {
        if (!block.outputConnection) {
          throw TypeError("Expecting string from statement block: " + block.type);
        }
        return [this.scrub_(block, code[0], opt_thisOnly), code[1]];
      } else if (typeof code === "string") {
        if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
          code = this.injectId(this.STATEMENT_PREFIX, block) + code;
        }
        if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
          code = code + this.injectId(this.STATEMENT_SUFFIX, block);
        }
        return this.scrub_(block, code, opt_thisOnly);
      } else if (code === null) {
        return "";
      }
      throw SyntaxError("Invalid code generated: " + code);
    }
    /**
     * Generate code representing the specified value input.
     *
     * @param block The block containing the input.
     * @param name The name of the input.
     * @param outerOrder The maximum binding strength (minimum order value) of any
     *     operators adjacent to "block".
     * @returns Generated code or '' if no blocks are connected.
     * @throws ReferenceError if the specified input does not exist.
     */
    valueToCode(block, name, outerOrder) {
      if (isNaN(outerOrder)) {
        throw TypeError("Expecting valid order from block: " + block.type);
      }
      const targetBlock = block.getInputTargetBlock(name);
      if (!targetBlock && !block.getInput(name)) {
        throw ReferenceError(`Input "${name}" doesn't exist on "${block.type}"`);
      }
      if (!targetBlock) {
        return "";
      }
      const tuple = this.blockToCode(targetBlock);
      if (tuple === "") {
        return "";
      }
      if (!Array.isArray(tuple)) {
        throw TypeError(
          `Expecting tuple from value block: ${targetBlock.type} See developers.google.com/blockly/guides/create-custom-blocks/generating-code for more information`
        );
      }
      let code = tuple[0];
      const innerOrder = tuple[1];
      if (isNaN(innerOrder)) {
        throw TypeError(
          "Expecting valid order from value block: " + targetBlock.type
        );
      }
      if (!code) {
        return "";
      }
      let parensNeeded = false;
      const outerOrderClass = Math.floor(outerOrder);
      const innerOrderClass = Math.floor(innerOrder);
      if (outerOrderClass <= innerOrderClass) {
        if (outerOrderClass === innerOrderClass && (outerOrderClass === 0 || outerOrderClass === 99)) {
        } else {
          parensNeeded = true;
          for (let i = 0; i < this.ORDER_OVERRIDES.length; i++) {
            if (this.ORDER_OVERRIDES[i][0] === outerOrder && this.ORDER_OVERRIDES[i][1] === innerOrder) {
              parensNeeded = false;
              break;
            }
          }
        }
      }
      if (parensNeeded) {
        code = "(" + code + ")";
      }
      return code;
    }
    /**
     * Generate a code string representing the blocks attached to the named
     * statement input. Indent the code.
     * This is mainly used in generators. When trying to generate code to evaluate
     * look at using workspaceToCode or blockToCode.
     *
     * @param block The block containing the input.
     * @param name The name of the input.
     * @returns Generated code or '' if no blocks are connected.
     * @throws ReferenceError if the specified input does not exist.
     */
    statementToCode(block, name) {
      const targetBlock = block.getInputTargetBlock(name);
      if (!targetBlock && !block.getInput(name)) {
        throw ReferenceError(`Input "${name}" doesn't exist on "${block.type}"`);
      }
      let code = this.blockToCode(targetBlock);
      if (typeof code !== "string") {
        throw TypeError(
          "Expecting code from statement block: " + (targetBlock && targetBlock.type)
        );
      }
      if (code) {
        code = this.prefixLines(code, this.INDENT);
      }
      return code;
    }
    /**
     * Add an infinite loop trap to the contents of a loop.
     * Add statement suffix at the start of the loop block (right after the loop
     * statement executes), and a statement prefix to the end of the loop block
     * (right before the loop statement executes).
     *
     * @param branch Code for loop contents.
     * @param block Enclosing block.
     * @returns Loop contents, with infinite loop trap added.
     */
    addLoopTrap(branch, block) {
      if (this.INFINITE_LOOP_TRAP) {
        branch = this.prefixLines(
          this.injectId(this.INFINITE_LOOP_TRAP, block),
          this.INDENT
        ) + branch;
      }
      if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
        branch = this.prefixLines(
          this.injectId(this.STATEMENT_SUFFIX, block),
          this.INDENT
        ) + branch;
      }
      if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
        branch = branch + this.prefixLines(
          this.injectId(this.STATEMENT_PREFIX, block),
          this.INDENT
        );
      }
      return branch;
    }
    /**
     * Inject a block ID into a message to replace '%1'.
     * Used for STATEMENT_PREFIX, STATEMENT_SUFFIX, and INFINITE_LOOP_TRAP.
     *
     * @param msg Code snippet with '%1'.
     * @param block Block which has an ID.
     * @returns Code snippet with ID.
     */
    injectId(msg, block) {
      const id = block.id.replace(/\$/g, "$$$$");
      return msg.replace(/%1/g, "'" + id + "'");
    }
    /**
     * Add one or more words to the list of reserved words for this language.
     *
     * @param words Comma-separated list of words to add to the list.
     *     No spaces.  Duplicates are ok.
     */
    addReservedWords(words) {
      this.RESERVED_WORDS_ += words + ",";
    }
    /**
     * Define a developer-defined function (not a user-defined procedure) to be
     * included in the generated code.  Used for creating private helper
     * functions. The first time this is called with a given desiredName, the code
     * is saved and an actual name is generated.  Subsequent calls with the same
     * desiredName have no effect but have the same return value.
     *
     * It is up to the caller to make sure the same desiredName is not
     * used for different helper functions (e.g. use "colourRandom" and
     * "listRandom", not "random").  There is no danger of colliding with reserved
     * words, or user-defined variable or procedure names.
     *
     * The code gets output when CodeGenerator.finish() is called.
     *
     * @param desiredName The desired name of the function (e.g. mathIsPrime).
     * @param code A list of statements or one multi-line code string.  Use '  '
     *     for indents (they will be replaced).
     * @returns The actual name of the new function.  This may differ from
     *     desiredName if the former has already been taken by the user.
     */
    provideFunction_(desiredName, code) {
      if (!this.definitions_[desiredName]) {
        const functionName = this.nameDB_.getDistinctName(
          desiredName,
          NameType.PROCEDURE
        );
        this.functionNames_[desiredName] = functionName;
        if (Array.isArray(code)) {
          code = code.join("\n");
        }
        let codeText = code.trim().replace(this.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);
        let oldCodeText;
        while (oldCodeText !== codeText) {
          oldCodeText = codeText;
          codeText = codeText.replace(/^(( {2})*) {2}/gm, "$1\0");
        }
        codeText = codeText.replace(/\0/g, this.INDENT);
        this.definitions_[desiredName] = codeText;
      }
      return this.functionNames_[desiredName];
    }
    /**
     * Gets a unique, legal name for a user-defined variable.
     * Before calling this method, the `nameDB_` property of the class
     * must have been initialized already. This is typically done in
     * the `init` function of the code generator class.
     *
     * @param nameOrId The ID of the variable to get a name for,
     *    or the proposed name for a variable not associated with an id.
     * @returns A unique, legal name for the variable.
     */
    getVariableName(nameOrId) {
      return this.getName(nameOrId, NameType.VARIABLE);
    }
    /**
     * Gets a unique, legal name for a user-defined procedure.
     * Before calling this method, the `nameDB_` property of the class
     * must have been initialized already. This is typically done in
     * the `init` function of the code generator class.
     *
     * @param name The proposed name for a procedure.
     * @returns A unique, legal name for the procedure.
     */
    getProcedureName(name) {
      return this.getName(name, NameType.PROCEDURE);
    }
    getName(nameOrId, type) {
      if (!this.nameDB_) {
        throw new Error(
          "Name database is not defined. You must initialize `nameDB_` in your generator class and call `init` first."
        );
      }
      return this.nameDB_.getName(nameOrId, type);
    }
    /**
     * Hook for code to run before code generation starts.
     * Subclasses may override this, e.g. to initialise the database of variable
     * names.
     *
     * @param _workspace Workspace to generate code from.
     */
    init(_workspace) {
      this.definitions_ = /* @__PURE__ */ Object.create(null);
      this.functionNames_ = /* @__PURE__ */ Object.create(null);
    }
    /**
     * Common tasks for generating code from blocks.  This is called from
     * blockToCode and is called on every block, not just top level blocks.
     * Subclasses may override this, e.g. to generate code for statements
     * following the block, or to handle comments for the specified block and any
     * connected value blocks.
     *
     * @param _block The current block.
     * @param code The code created for this block.
     * @param _opt_thisOnly True to generate code for only this statement.
     * @returns Code with comments and subsequent blocks added.
     */
    scrub_(_block, code, _opt_thisOnly) {
      return code;
    }
    /**
     * Hook for code to run at end of code generation.
     * Subclasses may override this, e.g. to prepend the generated code with
     * import statements or variable definitions.
     *
     * @param code Generated code.
     * @returns Completed code.
     */
    finish(code) {
      this.definitions_ = /* @__PURE__ */ Object.create(null);
      this.functionNames_ = /* @__PURE__ */ Object.create(null);
      return code;
    }
    /**
     * Naked values are top-level blocks with outputs that aren't plugged into
     * anything.
     * Subclasses may override this, e.g. if their language does not allow
     * naked values.
     *
     * @param line Line of generated code.
     * @returns Legal line of code.
     */
    scrubNakedValue(line) {
      return line;
    }
  };

  // core/inputs/input_types.ts
  var inputTypes = ((inputTypes2) => {
    inputTypes2[inputTypes2["VALUE"] = 1 /* INPUT_VALUE */] = "VALUE";
    inputTypes2[inputTypes2["STATEMENT"] = 3 /* NEXT_STATEMENT */] = "STATEMENT";
    inputTypes2[inputTypes2["DUMMY"] = 5] = "DUMMY";
    inputTypes2[inputTypes2["CUSTOM"] = 6] = "CUSTOM";
    inputTypes2[inputTypes2["END_ROW"] = 7] = "END_ROW";
    return inputTypes2;
  })(inputTypes || {});

  // core/utils/string.ts
  function wrap(text, limit) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      lines[i] = wrapLine(lines[i], limit);
    }
    return lines.join("\n");
  }
  function wrapLine(text, limit) {
    if (text.length <= limit) {
      return text;
    }
    const words = text.trim().split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > limit) {
        limit = words[i].length;
      }
    }
    let lastScore;
    let score = -Infinity;
    let lastText;
    let lineCount = 1;
    do {
      lastScore = score;
      lastText = text;
      let wordBreaks = [];
      const steps = words.length / lineCount;
      let insertedBreaks = 1;
      for (let i = 0; i < words.length - 1; i++) {
        if (insertedBreaks < (i + 1.5) / steps) {
          insertedBreaks++;
          wordBreaks[i] = true;
        } else {
          wordBreaks[i] = false;
        }
      }
      wordBreaks = wrapMutate(words, wordBreaks, limit);
      score = wrapScore(words, wordBreaks, limit);
      text = wrapToText(words, wordBreaks);
      lineCount++;
    } while (score > lastScore);
    return lastText;
  }
  function wrapScore(words, wordBreaks, limit) {
    const lineLengths = [0];
    const linePunctuation = [];
    for (let i = 0; i < words.length; i++) {
      lineLengths[lineLengths.length - 1] += words[i].length;
      if (wordBreaks[i] === true) {
        lineLengths.push(0);
        linePunctuation.push(words[i].charAt(words[i].length - 1));
      } else if (wordBreaks[i] === false) {
        lineLengths[lineLengths.length - 1]++;
      }
    }
    const maxLength = Math.max(...lineLengths);
    let score = 0;
    for (let i = 0; i < lineLengths.length; i++) {
      score -= Math.pow(Math.abs(limit - lineLengths[i]), 1.5) * 2;
      score -= Math.pow(maxLength - lineLengths[i], 1.5);
      if (".?!".includes(linePunctuation[i])) {
        score += limit / 3;
      } else if (",;)]}".includes(linePunctuation[i])) {
        score += limit / 4;
      }
    }
    if (lineLengths.length > 1 && lineLengths[lineLengths.length - 1] <= lineLengths[lineLengths.length - 2]) {
      score += 0.5;
    }
    return score;
  }
  function wrapMutate(words, wordBreaks, limit) {
    let bestScore = wrapScore(words, wordBreaks, limit);
    let bestBreaks;
    for (let i = 0; i < wordBreaks.length - 1; i++) {
      if (wordBreaks[i] === wordBreaks[i + 1]) {
        continue;
      }
      const mutatedWordBreaks = new Array().concat(wordBreaks);
      mutatedWordBreaks[i] = !mutatedWordBreaks[i];
      mutatedWordBreaks[i + 1] = !mutatedWordBreaks[i + 1];
      const mutatedScore = wrapScore(words, mutatedWordBreaks, limit);
      if (mutatedScore > bestScore) {
        bestScore = mutatedScore;
        bestBreaks = mutatedWordBreaks;
      }
    }
    if (bestBreaks) {
      return wrapMutate(words, bestBreaks, limit);
    }
    return wordBreaks;
  }
  function wrapToText(words, wordBreaks) {
    const text = [];
    for (let i = 0; i < words.length; i++) {
      text.push(words[i]);
      if (wordBreaks[i] !== void 0) {
        text.push(wordBreaks[i] ? "\n" : " ");
      }
    }
    return text.join("");
  }
  function isNumber(str) {
    return /^\s*-?\d+(\.\d+)?\s*$/.test(str);
  }

  // generators/java/java_generator.ts
  var Order = /* @__PURE__ */ ((Order2) => {
    Order2[Order2["ATOMIC"] = 0] = "ATOMIC";
    Order2[Order2["MEMBER"] = 1] = "MEMBER";
    Order2[Order2["FUNCTION_CALL"] = 2] = "FUNCTION_CALL";
    Order2[Order2["MODULUS"] = 3] = "MODULUS";
    Order2[Order2["DIVISION"] = 3] = "DIVISION";
    Order2[Order2["MULTIPLICATION"] = 3] = "MULTIPLICATION";
    Order2[Order2["ADDITION"] = 4] = "ADDITION";
    Order2[Order2["SUBTRACTION"] = 4] = "SUBTRACTION";
    Order2[Order2["UNARY_NEGATION"] = 5] = "UNARY_NEGATION";
    Order2[Order2["RELATIONAL"] = 6] = "RELATIONAL";
    Order2[Order2["EQUALITY"] = 7] = "EQUALITY";
    Order2[Order2["LOGICAL_NOT"] = 8] = "LOGICAL_NOT";
    Order2[Order2["LOGICAL_AND"] = 9] = "LOGICAL_AND";
    Order2[Order2["LOGICAL_OR"] = 10] = "LOGICAL_OR";
    Order2[Order2["CONDITIONAL"] = 11] = "CONDITIONAL";
    Order2[Order2["ASSIGNMENT"] = 12] = "ASSIGNMENT";
    Order2[Order2["NONE"] = 99] = "NONE";
    return Order2;
  })(Order || {});
  var JavaGenerator = class extends CodeGenerator {
    constructor(name = "Java") {
      super(name);
      this.ORDER_OVERRIDES = [
        [4 /* ADDITION */, 4 /* ADDITION */],
        [3 /* MULTIPLICATION */, 3 /* MULTIPLICATION */]
      ];
      this.isInitialized = false;
      for (const key in Order) {
        const value = Order[key];
        if (typeof value === "string") continue;
        this["ORDER_" + key] = value;
      }
      this.addReservedWords(
        "abstract,assert,boolean,break,byte,case,catch,char,class,const,continue,default,do,double,else,enum,extends,final,finally,float,for,goto,if,implements,import,instanceof,int,interface,long,native,new,package,private,protected,public,return,short,static,strictfp,super,switch,synchronized,this,throw,throws,transient,try,void,volatile,while"
      );
    }
    init(workspace) {
      super.init(workspace);
      if (!this.nameDB_) {
        this.nameDB_ = new Names(this.RESERVED_WORDS_);
      } else {
        this.nameDB_.reset();
      }
      this.nameDB_.setVariableMap(workspace.getVariableMap());
      this.nameDB_.populateVariables(workspace);
      this.nameDB_.populateProcedures(workspace);
      const defvars = [];
      const devVarList = allDeveloperVariables(workspace);
      for (let i = 0; i < devVarList.length; i++) {
        defvars.push(this.nameDB_.getName(devVarList[i], NameType.DEVELOPER_VARIABLE));
      }
      const variables = allUsedVarModels(workspace);
      for (let i = 0; i < variables.length; i++) {
        defvars.push(this.nameDB_.getName(variables[i].getId(), NameType.VARIABLE));
      }
      if (defvars.length) {
        this.definitions_["variables"] = "int " + defvars.join(", ") + ";";
      }
      this.isInitialized = true;
    }
    finish(code) {
      const definitions = Object.values(this.definitions_);
      super.finish(code);
      this.isInitialized = false;
      this.nameDB_.reset();
      return definitions.join("\n\n") + "\n\n" + code;
    }
    scrubNakedValue(line) {
      return line + ";\n";
    }
    quote_(text) {
      text = text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/"/g, '\\"');
      return `"${text}"`;
    }
    multiline_quote_(text) {
      const lines = text.split(/\n/g).map(this.quote_);
      return lines.join(' + "\\n" +\n');
    }
    scrub_(block, code, thisOnly = false) {
      let commentCode = "";
      if (!block.outputConnection || !block.outputConnection.targetConnection) {
        let comment = block.getCommentText();
        if (comment) {
          comment = wrap(comment, this.COMMENT_WRAP - 3);
          commentCode += this.prefixLines(comment + "\n", "// ");
        }
        for (let i = 0; i < block.inputList.length; i++) {
          if (block.inputList[i].type === inputTypes.VALUE) {
            const childBlock = block.inputList[i].connection.targetBlock();
            if (childBlock) {
              comment = this.allNestedComments(childBlock);
              if (comment) {
                commentCode += this.prefixLines(comment, "// ");
              }
            }
          }
        }
      }
      const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
      const nextCode = thisOnly ? "" : this.blockToCode(nextBlock);
      return commentCode + code + nextCode;
    }
    getAdjusted(block, atId, delta = 0, negate = false, order = 99 /* NONE */) {
      if (block.workspace.options.oneBasedIndex) delta--;
      const defaultAtIndex = block.workspace.options.oneBasedIndex ? "1" : "0";
      let orderForInput = order;
      if (delta > 0) orderForInput = 4 /* ADDITION */;
      else if (delta < 0) orderForInput = 4 /* SUBTRACTION */;
      else if (negate) orderForInput = 5 /* UNARY_NEGATION */;
      let at = this.valueToCode(block, atId, orderForInput) || defaultAtIndex;
      if (delta === 0 && !negate) return at;
      if (isNumber(at)) {
        at = String(Number(at) + delta);
        if (negate) at = String(-Number(at));
        return at;
      }
      if (delta > 0) at = `${at} + ${delta}`;
      else if (delta < 0) at = `${at} - ${-delta}`;
      if (negate) at = delta ? `-(${at})` : `-${at}`;
      if (Math.floor(order) >= Math.floor(orderForInput)) at = `(${at})`;
      return at;
    }
  };
  var java_generator_default = new JavaGenerator();
  return __toCommonJS(java_generator_exports);
})();
/**
 * @license
 * Copyright 2013 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
